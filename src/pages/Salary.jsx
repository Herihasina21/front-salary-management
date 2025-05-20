import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { SalaryService } from '../services/SalaryService';
import { EmployeeService } from '../services/EmployeeService';
import { MdAdd } from "react-icons/md";
import Select from "react-select";
import { InputNumber } from 'primereact/inputnumber';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const INITIAL_SALARY = {
  baseSalary: 0,
  employeeId: '',
};

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [newSalary, setNewSalary] = useState(INITIAL_SALARY);
  const [editingSalary, setEditingSalary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState(null);
  const deleteModalRef = useRef();

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.name} ${emp.firstName}`
  }));

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await SalaryService.getAllSalary();
      setSalaries(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des salaires:', error);
      const message = error.response?.data?.message || "Erreur lors du chargement des salaires";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await EmployeeService.getAllEmployees();
      setEmployees(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
      const message = error.response?.data?.message || "Erreur lors du chargement des employés";
      toast.error(message);
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));

    let newValue = value;
    if (name === 'baseSalary' && value < 0) {
      return;
    }

    const updateSalaryState = (salary) => {
      return { ...salary, [name]: newValue };
    };

    if (isEditing) {
      setEditingSalary(prev => updateSalaryState(prev));
    } else {
      setNewSalary(prev => updateSalaryState(prev));
    }
  };

  const validateForm = (salary) => {
    let isValid = true;
    const newErrors = {};

    if (!salary.baseSalary || isNaN(salary.baseSalary) || parseFloat(salary.baseSalary) <= 0) {
      newErrors.baseSalary = 'Le salaire de base doit être un nombre positif.';
      isValid = false;
    }

    if (!salary.employeeId) {
      newErrors.employeeId = 'L\'employé est obligatoire.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setNewSalary(INITIAL_SALARY);
    setEditingSalary(null);
    setErrors({});
  };

  const addSalary = async () => {
    if (!validateForm(newSalary)) {
      return;
    }

    setLoading(true);
    try {
      const response = await SalaryService.createSalary(newSalary);
      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        await fetchSalaries();
        document.getElementById("closeAddModal")?.click();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du salaire:', error);
      toast.error(error.response?.data?.message || "Une erreur inattendue est survenue");
    } finally {
      setLoading(false);
    }
  };

  const updateSalary = async () => {
    if (!editingSalary?.id) return;
    if (!validateForm(editingSalary)) {
      return;
    }

    setLoading(true);
    try {
      const response = await SalaryService.updateSalary(editingSalary.id, editingSalary);
      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        await fetchSalaries();
        document.getElementById("closeEditModal")?.click();
      } else {
        toast.error(response.data.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du salaire:', error);
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "Une erreur inattendue est survenue";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (salary) => {
    setEditingSalary({
      ...salary,
      employeeId: salary.employee?.id || ''
    });
    setErrors({});
  };

  const deleteSalary = async (id) => {
    setSalaryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!salaryToDelete) return;

    setLoading(true);
    setShowDeleteModal(false);

    try {
      const response = await SalaryService.deleteSalary(salaryToDelete);
      toast.success(response.data.message);
      await fetchSalaries();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de la suppression du salaire';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setSalaryToDelete(null);
    }
  };

  const filteredSalaries = salaries.filter(salary => {
    const searchLower = searchTerm.toLowerCase();
    const employee = employees.find(emp => emp.id === salary.employee?.id);
    const employeeName = employee ? `${employee.name} ${employee.firstName}`.toLowerCase() : '';

    return (
      employeeName.includes(searchLower) ||
      salary.baseSalary.toString().includes(searchTerm)
    );
  });

  return (
    <div className="pc-container">
      <div className="pc-content">
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="page-header-title">
                  <h5 className="m-b-10">Gérer les salaires</h5>
                </div>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">Pages</li>
                  <li className="breadcrumb-item">Salaires</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6>Liste des Salaires ({filteredSalaries.length}/{salaries.length})</h6>
                <div className="d-flex">
                  <div className="input-group me-3" style={{ width: '300px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="ti ti-search"></i>
                    </button>
                  </div>
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#addModal"
                  >
                    <MdAdd className="me-2" /> Ajouter un Salaire
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th className="border-start">ID</th>
                        <th>Salaire de base</th>
                        <th>Employé</th>
                        <th className="border-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalaries.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4 border-start border-end">
                            {salaries.length === 0 ? (
                              <div>
                                <p className="text-muted">Aucun salaire enregistré</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-muted">Aucun résultat trouvé</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredSalaries.map(salary => (
                          <tr key={salary.id}>
                            <td className="border-start">{salary.id}</td>
                            <td>
                              <div className="fw-medium">
                                {new Intl.NumberFormat('fr-FR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                }).format(salary.baseSalary)} Ar
                              </div>
                            </td>
                            <td>
                              <div className="fw-medium">
                                {employees.find(emp => emp.id === salary.employee?.id)?.name + ' '}
                                {employees.find(emp => emp.id === salary.employee?.id)?.firstName}
                              </div>
                            </td>
                            <td className="text-center border-end">
                              <ul className="me-auto mb-0" style={{ display: 'flex', flexDirection: 'row', paddingLeft: 0, listStyle: 'none', marginLeft: '-5px' }}>
                                <li className="align-bottom" style={{ marginRight: '10px' }}>
                                  <a className="avtar avtar-xs btn-link-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editModal"
                                    onClick={() => handleEditClick(salary)}
                                    style={{ cursor: 'pointer' }}>
                                    <i className="ti ti-edit-circle f-18"></i>
                                  </a>
                                </li>
                                <li className="align-bottom">
                                  <a className="avtar avtar-xs btn-link-danger"
                                    onClick={() => deleteSalary(salary.id)}
                                    style={{ cursor: 'pointer' }}>
                                    <i className="ti ti-trash f-18" style={{ color: 'red' }}></i>
                                  </a>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal d'ajout */}
        <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addModalLabel">Ajouter un Salaire</h5>
                <button type="button" className="btn-close" id="closeAddModal" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
              </div>
              <div className="modal-body">
                {renderSalaryForm(newSalary, handleInputChange, employees, employeeOptions, false, errors)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                <button type="button" className="btn btn-primary" onClick={addSalary} disabled={loading}>
                  {loading ? 'Ajout en cours...' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de modification */}
        <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">Modifier un Salaire</h5>
                <button type="button" className="btn-close" id="closeEditModal" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
              </div>
              <div className="modal-body">
                {editingSalary && renderSalaryForm(editingSalary, handleInputChange, employees, employeeOptions, true, errors)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                <button type="button" className="btn btn-primary" onClick={updateSalary} disabled={loading}>
                  {loading ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Modal de suppression */}
        {showDeleteModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" ref={deleteModalRef}>
                <div className="modal-header">
                  <h5 className="modal-title">Confirmer la suppression</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Êtes-vous sûr de vouloir supprimer ce salaire ? Cette action est irréversible.</p>
                  {salaryToDelete && (
                    <div className="alert alert-info">
                      <i className="ti ti-alert-circle me-2"></i>
                      <strong>Salaire concerné :</strong> {salaries.find(e => e.id === salaryToDelete)?.baseSalary} Ar pour l'employé {employees.find(e => e.id === salaries.find(s => s.id === salaryToDelete)?.employee?.id)?.name} {employees.find(e => e.id === salaries.find(s => s.id === salaryToDelete)?.employee?.id)?.firstName}.
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                    disabled={loading}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDelete}
                    disabled={loading}
                  >
                    {loading ? 'Suppression en cours...' : 'Confirmer la suppression'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant réutilisable pour le formulaire de salaire - VERSION CORRIGÉE
const renderSalaryForm = (salary, handleChange, employees, employeeOptions, isEditing = false, errors) => {
  const handleNumberChange = (e, isEditing) => {
    const fakeEvent = {
      target: {
        name: 'baseSalary',
        value: e.value
      }
    };
    handleChange(fakeEvent, isEditing);
  };

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="baseSalary" className="form-label">Salaire de base</label>
        <InputNumber
          inputId="baseSalary"
          value={salary.baseSalary || 0}
          onValueChange={(e) => handleNumberChange(e, isEditing)}
          mode="decimal"
          locale="fr-FR"
          className={`w-100 ${errors.baseSalary ? 'p-invalid' : ''}`}
          min={0}
          step={10000}
          suffix=" Ar"
          minFractionDigits={2}
          maxFractionDigits={2}
          showButtons
          buttonLayout="stacked"
          incrementButtonClassName="p-button p-button-secondary"
          decrementButtonClassName="p-button p-button-secondary"
        />
        {errors.baseSalary && (
          <div className="invalid-feedback d-block">{errors.baseSalary}</div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="employeeId">Employé</label>
        {isEditing ? (
          <input
            type="text"
            className="form-control bg-light"
            value={
              employees.find(e => e.id === salary.employeeId)?.name + ' ' +
              employees.find(e => e.id === salary.employeeId)?.firstName || ''
            }
            readOnly
          />
        ) : (
          <Select
            name="employeeId"
            value={employeeOptions.find(opt => opt.value === salary.employeeId) || null}
            onChange={(selected) =>
              handleChange({
                target: { name: 'employeeId', value: selected ? selected.value : '' }
              }, isEditing)
            }
            options={employeeOptions}
            isClearable
            placeholder="-- Sélectionner un employé --"
            noOptionsMessage={() => "Aucune option disponible"}
            className={errors.employeeId ? 'is-invalid' : ''}
            classNamePrefix="react-select"
          />
        )}
        {errors.employeeId && (
          <div className="invalid-feedback d-block">{errors.employeeId}</div>
        )}
      </div>
    </form>
  );
};

export default Salary;