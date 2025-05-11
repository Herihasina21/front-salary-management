import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DeductionService } from '../services/DeductionService';
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import Select from "react-select";

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
  amount: '',
};

const Deduction = () => {
  const [deductions, setDeductions] = useState([]);
  const [newDeduction, setNewDeduction] = useState(INITIAL_DEDUCTION);
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    // Prevent negative numbers
    let newValue = value;
    if (name === 'amount' && value < 0) {
      return; // Stop update, keep previous value
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
    if (!deduction.amount || isNaN(deduction.amount) || parseFloat(deduction.amount) <= 0) {
      newErrors.amount = 'Le montant doit être un nombre positif.';
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
    setEditingDeduction({ ...deduction });
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

  return (
    <div className="pc-container">
      <div className="pc-content">
        {/* [ breadcrumb ] start */}
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
        {/* [ breadcrumb ] end */}

        {/* [ Main Content ] start */}
        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6>Liste des Déductions</h6>
                <button className="btn btn-primary d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#addModal">
                  <MdAdd className="me-2" /> Ajouter une Déduction
                </button>
              </div>
              <div className="card-body">
                <div className="dt-responsive table-responsive">
                  <table className="table table-striped table-bordered nowrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Montant (Ar)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deductions.length === 0 ? (
                        <tr><td colSpan="6">Aucune déduction trouvée</td></tr>
                      ) : (
                        deductions.map(deduction => (
                          <tr key={deduction.id}>
                            <td>{deduction.id}</td>
                            <td>{deduction.type}</td>
                            <td>{deduction.amount}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-warning me-2 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => handleEditClick(deduction)}>
                                  <MdEdit className="me-1" /> Modifier
                                </button>
                                <button className="btn btn-sm btn-danger d-flex align-items-center" onClick={() => deleteDeduction(deduction.id)}>
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
  );
};

// Composant réutilisable pour le formulaire de déduction
const renderDeductionForm = (deduction, handleChange, isEditing = false, errors) => (
        <form>
          <div className="form-floating mb-3">
            <input
                    type="number"
                    className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                    name="amount"
                    value={deduction.amount}
                    onChange={(e) => handleChange(e, isEditing)}
                    placeholder="Montant (Ar)"
                    min="1"
                    required
            />
            <label htmlFor="amount">Montant (Ar)</label>
            {errors.amount && (
                    <div className="invalid-feedback">{errors.amount}</div>
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

export default Deduction;
