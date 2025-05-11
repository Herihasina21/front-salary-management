import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SalaryService } from '../services/SalaryService';
import { EmployeeService } from '../services/EmployeeService';
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

const INITIAL_SALARY = {
  baseSalary: '',
  employeeId: '',
};

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [newSalary, setNewSalary] = useState(INITIAL_SALARY);
  const [editingSalary, setEditingSalary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    // Prevent negative numbers
    let newValue = value;
    if (name === 'baseSalary' && value < 0) {
      return; // Stop update, keep previous value
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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce salaire ?")) {
      setLoading(true);
      try {
        const response = await SalaryService.deleteSalary(id);
        toast.success(response.data.message);
        await fetchSalaries();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        const errorMsg = error.response?.data?.message
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="pc-container">
      <div className="pc-content">
        {/* [ breadcrumb ] start */}
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
        {/* [ breadcrumb ] end */}

        {/* [ Main Content ] start */}
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6>Liste des Salaires</h6>
                <button className="btn btn-primary d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#addModal">
                  <MdAdd className="me-2" /> Ajouter un Salaire
                </button>
              </div>
              <div className="card-body">
                <div className="dt-responsive table-responsive">
                  <table className="table table-striped table-bordered nowrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Salaire de base(Ar)</th>
                        <th>Employé</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaries.length === 0 ? (
                        <tr><td colSpan="6">Aucun salaire trouvé</td></tr>
                      ) : (
                        salaries.map(salary => (
                          <tr key={salary.id}>
                            <td>{salary.id}</td>
                            <td>{salary.baseSalary}</td>
                            <td>{employees.find(emp => emp.id === salary.employee?.id)?.name} {employees.find(emp => emp.id === salary.employee?.id)?.firstName}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-warning me-2 d-flex align-items-center"
                                  data-bs-toggle="modal"
                                  data-bs-target="#editModal"
                                  onClick={() => handleEditClick(salary)}
                                >
                                  <MdEdit className="me-1" /> Modifier
                                </button>
                                <button
                                  className="btn btn-sm btn-danger d-flex align-items-center"
                                  onClick={() => deleteSalary(salary.id)}
                                >
                                  <MdDelete className="me-1" /> Supprimer
                                </button>
                              </div>
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
      </div>
      {/* [ Main Content ] end */}

      {/* Modal d'ajout */}
      <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addModalLabel">Ajouter un Salaire</h5>
              <button type="button" className="btn-close" id="closeAddModal" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {renderSalaryForm(newSalary, handleInputChange, employees, false, errors)}
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
              <button type="button" className="btn-close" id="closeEditModal" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {editingSalary && renderSalaryForm(editingSalary, handleInputChange, employees, true, errors)}
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
    </div>
  );
};

// Composant réutilisable pour le formulaire de salaire
const renderSalaryForm = (salary, handleChange, employees, isEditing = false, errors) => (
  <form>
    <div className="form-floating mb-3">
      <input
        type="number"
        className={`form-control ${errors.baseSalary ? 'is-invalid' : ''}`}
        name="baseSalary"
        value={salary.baseSalary}
        onChange={(e) => handleChange(e, isEditing)}
        placeholder="Salaire de base"
        min="1"
        required
      />
      <label htmlFor="baseSalary">Salaire de base(Ar)</label>
      {errors.baseSalary && (
        <div className="invalid-feedback">{errors.baseSalary}</div>
      )}
    </div>
    <div className="mb-3">
      <label htmlFor="employeeId">Employé</label>
      {isEditing ? (
        <input
          type="text"
          className="form-control bg-light"
          value={employees.find(e => e.id === salary.employeeId)?.name + ' ' +
            employees.find(e => e.id === salary.employeeId)?.firstName || ''}
          readOnly
        />
      ) : (
        <select
          className={`form-select ${errors.employeeId ? 'is-invalid' : ''}`}
          name="employeeId"
          value={salary.employeeId}
          onChange={(e) => handleChange(e, isEditing)}
          required
        >
          <option value="">-- Sélectionner un employé --</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.name} {emp.firstName}</option>
          ))}
        </select>
      )}
      {errors.employeeId && (
        <div className="invalid-feedback">{errors.employeeId}</div>
      )}
    </div>
  </form>
);

export default Salary;
