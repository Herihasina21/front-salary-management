import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { DeductionService } from '../services/DeductionService'; 
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

const INITIAL_DEDUCTION = {
  type: '',
  amount: ''
};

const Deduction = () => {
  const [deductions, setDeductions] = useState([]);
  const [newDeduction, setNewDeduction] = useState(INITIAL_DEDUCTION);
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (isEditing) {
      setEditingDeduction(prev => ({ ...prev, [name]: value }));
    } else {
      setNewDeduction(prev => ({ ...prev, [name]: value === "" ? null : value }));
    }
  };

  const resetForm = () => {
    setNewDeduction(INITIAL_DEDUCTION);
    setEditingDeduction(null);
  };

  const addDeduction = async () => {
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
              <div className="card-body px-0 pt-0 pb-2">
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Montant</th>
                        <th>Fiche de Paie</th>
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
                            <td>{deduction.payroll?.id || 'N/A'}</td>
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
              {renderDeductionForm(newDeduction, handleInputChange, false)}
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
              {editingDeduction && renderDeductionForm(editingDeduction, handleInputChange, true)}
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
const renderDeductionForm = (deduction, handleChange, isEditing = false) => (
  <form>
    <div className="mb-3">
      <label className="form-label">Type de Déduction</label>
      <input
        type="text"
        className="form-control"
        name="type"
        value={deduction.type}
        onChange={(e) => handleChange(e, isEditing)}
        placeholder="Type (Ex: CNAPS, OSTIE, Absence)"
        required
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Montant (Ar)</label>
      <input
        type="number"
        className="form-control"
        name="amount"
        value={deduction.amount}
        onChange={(e) => handleChange(e, isEditing)}
        placeholder="Montant (Ar)"
        required
      />
    </div>
  </form>
);

export default Deduction;
