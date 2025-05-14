import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DeductionService } from '../services/DeductionService';
import { MdAdd } from "react-icons/md";
import Select from "react-select";
import { InputNumber } from 'primereact/inputnumber';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const DEDUCTION_TYPES = [
  "CNAPS",
  "OSTIE",
  "Absence",
  "Retard",
  "Avance sur salaire",
  "Autre"
];

const deductionTypeOptions = DEDUCTION_TYPES.map(type => ({
  value: type,
  label: type
}));

const INITIAL_DEDUCTION = {
  type: '',
  amount: 0
};

const Deduction = () => {
  const [deductions, setDeductions] = useState([]);
  const [newDeduction, setNewDeduction] = useState(INITIAL_DEDUCTION);
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDeductions = async () => {
    try {
      setLoading(true);
      const response = await DeductionService.getAllDeduction();
      setDeductions(response.data.data || []);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Erreur lors du chargement des déductions";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeductions();
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));

    let newValue = value;
    if (name === 'amount' && value < 0) {
      return;
    }

    if (isEditing) {
      setEditingDeduction(prev => ({ ...prev, [name]: newValue }));
    } else {
      setNewDeduction(prev => ({ ...prev, [name]: newValue }));
    }
  };

  const validateForm = (deduction) => {
    let isValid = true;
    const newErrors = {};

    if (!deduction.type) {
      newErrors.type = 'Le type de déduction est obligatoire.';
      isValid = false;
    }
    if (!deduction.amount || isNaN(deduction.amount)) {
      newErrors.amount = 'Le montant de la déduction est obligatoire.';
      isValid = false;
    } else if (parseFloat(deduction.amount) < 0) {
      newErrors.amount = 'Le montant ne peut pas être négatif.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setNewDeduction(INITIAL_DEDUCTION);
    setEditingDeduction(null);
    setErrors({});
  };

  const addDeduction = async () => {
    if (!validateForm(newDeduction)) {
      return;
    }

    setLoading(true);
    try {
      const response = await DeductionService.createDeduction(newDeduction);
      const message = response.data.message;
      toast.success(message);
      resetForm();
      await fetchDeductions();
      document.getElementById("closeAddModal")?.click();
    } catch (error) {
      console.error(error);
      console.error("Réponse d'erreur (ajout) :", error.response);
      const message = error.response?.data?.message || "Erreur lors de l'ajout de la déduction";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateDeduction = async () => {
    if (!editingDeduction?.id) return;
    if (!validateForm(editingDeduction)) {
      return;
    }
    setLoading(true);
    try {
      const response = await DeductionService.updateDeduction(editingDeduction.id, editingDeduction);
      const message = response.data.message;
      toast.success(message);
      resetForm();
      await fetchDeductions();
      document.getElementById("closeEditModal")?.click();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la déduction";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (deduction) => {
    setEditingDeduction({
      ...deduction,
      amount: parseFloat(deduction.amount)
    });
    setErrors({});
  };

  const deleteDeduction = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        setLoading(true);
        const response = await DeductionService.deleteDeduction(id);
        const message = response.data.message;
        toast.success(message);
        await fetchDeductions();
      } catch (error) {
        console.error(error);
        console.error("Réponse d'erreur (suppression) :", error.response);
        const message = error.response?.data?.message || "Erreur lors de la suppression de la déduction";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredDeductions = deductions.filter(deduction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      deduction.type.toLowerCase().includes(searchLower) ||
      deduction.amount.toString().includes(searchTerm)
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
                  <h5 className="m-b-10">Gérer les Déductions</h5>
                </div>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">Pages</li>
                  <li className="breadcrumb-item">Déductions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6>Liste des Déductions ({filteredDeductions.length}/{deductions.length})</h6>
                  <button
                    className="btn btn-primary d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#addModal"
                  >
                    <MdAdd className="me-2" /> Ajouter une Déduction
                  </button>
                </div>
                <div className="input-group" style={{ width: '300px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher par type ou montant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="ti ti-search"></i>
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="dt-responsive table-responsive">
                  <table className="table table-striped table-bordered nowrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Montant</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDeductions.length === 0 ? (
                        <tr>
                          <td colSpan="4">
                            {deductions.length === 0
                              ? "Aucune déduction trouvée"
                              : "Aucune déduction ne correspond à votre recherche"}
                          </td>
                        </tr>
                      ) : (
                        filteredDeductions.map(deduction => (
                          <tr key={deduction.id}>
                            <td>{deduction.id}</td>
                            <td>{deduction.type}</td>
                            <td>
                              {new Intl.NumberFormat('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }).format(deduction.amount)} Ar
                            </td>
                            <td className="text-center">
                              <ul className="me-auto mb-0" style={{ display: 'flex', flexDirection: 'row', paddingLeft: 0, listStyle: 'none', marginLeft: '-5px' }}>
                                <li className="align-bottom" style={{ marginRight: '10px' }}>
                                  <a className="avtar avtar-xs btn-link-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editModal"
                                    onClick={() => handleEditClick(deduction)}
                                    style={{ cursor: 'pointer' }}>
                                    <i className="ti ti-edit-circle f-18"></i>
                                  </a>
                                </li>
                                <li className="align-bottom">
                                  <a className="avtar avtar-xs btn-link-danger"
                                    onClick={() => deleteDeduction(deduction.id)}
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
                <h5 className="modal-title" id="addModalLabel">Ajouter une déduction</h5>
                <button type="button" className="btn-close" id="closeAddModal" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {renderDeductionForm(newDeduction, handleInputChange, false, errors)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                <button type="button" className="btn btn-primary" onClick={addDeduction} disabled={loading}>
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
                <h5 className="modal-title" id="editModalLabel">Modifier une déduction</h5>
                <button type="button" className="btn-close" id="closeEditModal" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {editingDeduction && renderDeductionForm(editingDeduction, handleInputChange, true, errors)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                <button type="button" className="btn btn-primary" onClick={updateDeduction} disabled={loading}>
                  {loading ? 'Mise à jour...' : 'Mettre à jour'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderDeductionForm = (deduction, handleChange, isEditing = false, errors) => {
  const handleNumberChange = (e, isEditing) => {
    const fakeEvent = {
      target: {
        name: 'amount',
        value: e.value
      }
    };
    handleChange(fakeEvent, isEditing);
  };

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="deductionAmount" className="form-label">Montant</label>
        <InputNumber
          inputId="deductionAmount"
          value={deduction.amount || 0}
          onValueChange={(e) => handleNumberChange(e, isEditing)}
          mode="decimal"
          locale="fr-FR"
          className={`w-100 ${errors.amount ? 'p-invalid' : ''}`}
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
        {errors.amount && (
          <div className="invalid-feedback d-block">{errors.amount}</div>
        )}
      </div>
      <div className={`mb-3 ${errors.type ? 'form-group position-relative' : ''}`}>
        <label className="form-label">Type de Déduction</label>
        <Select
          name="type"
          value={deductionTypeOptions.find(opt => opt.value === deduction.type) || null}
          onChange={(selected) =>
            handleChange(
              {
                target: {
                  name: 'type',
                  value: selected ? selected.value : ''
                }
              },
              isEditing
            )
          }
          options={deductionTypeOptions}
          isClearable
          placeholder="-- Sélectionner --"
          className={errors.type ? 'is-invalid' : ''}
          classNamePrefix="react-select"
        />
        {errors.type && (
          <div className="invalid-feedback d-block">{errors.type}</div>
        )}
      </div>
    </form>
  );
};

export default Deduction;