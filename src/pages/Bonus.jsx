import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BonusService } from '../services/BonusService';
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import Select from "react-select";

const BONUS_TYPES = [
  "Ancienneté",
  "Performance",
  "Prime",
  "Heures supplémentaires",
  "Autre"
];

const bonusTypeOptions = BONUS_TYPES.map(type => ({
  value: type,
  label: type
}));

const INITIAL_BONUS = {
  type: '',
  amount: '' // Changed to string to handle input directly
};

export default function Bonus() {
  const [bonuses, setBonuses] = useState([]);
  const [newBonus, setNewBonus] = useState(INITIAL_BONUS);
  const [editingBonus, setEditingBonus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchBonuses = async () => {
    setLoading(true);
    try {
      const response = await BonusService.getAllBonus();
      setBonuses(response.data.data || []);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Erreur lors de la récupération des bonus";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBonuses();
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    if (isEditing) {
      setEditingBonus(prev => ({ ...prev, [name]: value }));
    } else {
      setNewBonus(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (bonus) => {
    let isValid = true;
    const newErrors = {};

    if (!bonus.type) {
      newErrors.type = 'Le type de bonus est obligatoire.';
      isValid = false;
    }
    if (!bonus.amount.trim()) {
      newErrors.amount = 'Le montant du bonus est obligatoire.';
      isValid = false;
    } else if (!/^\d+$/.test(bonus.amount)) {
      newErrors.amount = 'Le montant doit contenir uniquement des chiffres.';
      isValid = false;
    } else if (parseFloat(bonus.amount) < 0) {
      newErrors.amount = 'Le montant ne peut pas être négatif.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetNewBonus = () => {
    setNewBonus(INITIAL_BONUS);
    setEditingBonus(null);
    setErrors({});
  };

  const addBonus = async () => {
    if (!validateForm(newBonus)) {
      return;
    }

    setLoading(true);
    try {
      const response = await BonusService.createBonus({ ...newBonus, amount: parseFloat(newBonus.amount) });
      toast.success(response.data.message);
      resetNewBonus();
      await fetchBonuses();
      document.getElementById('closeAddBonusModal')?.click();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du bonus :', error);
      const message = error.response?.data?.message || "Erreur lors de l'ajout du bonus";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateBonus = async () => {
    if (!editingBonus?.id) return;
    if (!validateForm(editingBonus)) {
      return;
    }

    setLoading(true);
    try {
      const response = await BonusService.updateBonus(editingBonus.id, { ...editingBonus, amount: parseFloat(editingBonus.amount) });
      toast.success(response.data.message);
      resetNewBonus();
      await fetchBonuses();
      document.getElementById('closeEditBonusModal')?.click();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bonus :', error);
      const message = error.response?.data?.message || "Erreur lors de la mise à jour du bonus";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteBonus = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bonus ?')) {
      try {
        const response = await BonusService.deleteBonus(id);
        toast.success(response.data.message);
        await fetchBonuses();
      } catch (error) {
        console.error('Erreur lors de la suppression du bonus :', error);
        const message = error.response?.data?.message || "Erreur lors de la suppression du bonus";
        toast.error(message);
      }
    }
  };

  const handleEditClick = (bonus) => {
    setEditingBonus({ ...bonus, amount: String(bonus.amount) }); // Convert amount to string for input
    setErrors({});
  };

  return (
    <div className="pc-container">
      <div className="pc-content">
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="page-header-title">
                  <h5 className="m-b-10">Gérer les Bonus</h5>
                </div>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">Pages</li>
                  <li className="breadcrumb-item">Bonus</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6>Liste des Bonus</h6>
                <button className="btn btn-primary d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#addBonusModal">
                  <MdAdd className="me-2" /> Ajouter un Bonus
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
                      {bonuses.length === 0 ? (
                        <tr><td colSpan="4">Aucun bonus trouvé</td></tr>
                      ) : (
                        bonuses.map(bonus => (
                          <tr key={bonus.id}>
                            <td>{bonus.id}</td>
                            <td>{bonus.type}</td>
                            <td>{bonus.amount}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-warning me-2 d-flex align-items-center"
                                  onClick={() => handleEditClick(bonus)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#editBonusModal"
                                >
                                  <MdEdit className="me-1" /> Modifier
                                </button>
                                <button
                                  className="btn btn-sm btn-danger d-flex align-items-center"
                                  onClick={() => deleteBonus(bonus.id)}
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

      {/* Modal d'ajout */}
      <div className="modal fade" id="addBonusModal" tabIndex="-1" aria-labelledby="addBonusModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addBonusModalLabel">Ajouter un Bonus</h5>
              <button type="button" className="btn-close" id="closeAddBonusModal" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {renderBonusForm(newBonus, handleInputChange, errors)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              <button type="button" className="btn btn-primary" onClick={addBonus} disabled={loading}>
                {loading ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de modification */}
      <div className="modal fade" id="editBonusModal" tabIndex="-1" aria-labelledby="editBonusModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editBonusModalLabel">Modifier le Bonus</h5>
              <button type="button" className="btn-close" id="closeEditBonusModal" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {editingBonus && renderBonusForm(editingBonus, (e) => handleInputChange(e, true), errors)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              <button type="button" className="btn btn-primary" onClick={updateBonus} disabled={loading}>
                {loading ? 'Mise à jour...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Formulaire Bonus (Réutilisable)
function renderBonusForm(bonus, onChange, errors) {
  return (
          <form>
            <div className="form-floating mb-3">
              <input
                      type="number"
                      className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                      id="floatingBonusAmount"
                      placeholder="Montant (Ar)"
                      name="amount"
                      value={bonus.amount}
                      onChange={onChange}
                      min="1"
              />
              <label htmlFor="floatingBonusAmount">Montant (Ar)</label>
              {errors.amount && (
                      <div className="invalid-feedback d-block mt-1">{errors.amount}</div>
              )}
            </div>
            <div className={`mb-3 ${errors.type ? 'form-group position-relative' : ''}`}>
              <label className="form-label">Type de bonus</label>
              <Select
                      name="type"
                      value={bonusTypeOptions.find(opt => opt.value === bonus.type) || null}
                      onChange={(selected) =>
                              onChange({
                                target: {
                                  name: 'type',
                                  value: selected ? selected.value : ''
                                }
                              })
                      }
                      options={bonusTypeOptions}
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
}
