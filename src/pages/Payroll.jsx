import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PayrollService } from '../services/PayrollService'; 
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

const INITIAL_PAYROLL = {
  periodStart: '',
  periodEnd: '',
  netSalary: '',
  employee: null,
};

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [newPayroll, setNewPayroll] = useState(INITIAL_PAYROLL);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const response = await PayrollService.getAllPayrolls();
      setPayrolls(response.data.data || []);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Erreur lors du chargement des fiches de paie";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingPayroll(prev => ({ ...prev, [name]: value }));
    } else {
      setNewPayroll(prev => ({ ...prev, [name]: value === "" ? null : value }));
    }
  };

  const resetForm = () => {
    setNewPayroll(INITIAL_PAYROLL);
    setEditingPayroll(null);
  };

  const addPayroll = async () => {
    setLoading(true);
    try {
      const response = await PayrollService.createPayroll(newPayroll);
      const message = response.data.message;
      toast.success(message);
      resetForm();
      await fetchPayrolls();
      document.getElementById("closeAddModal")?.click();
    } catch (error) {
      console.error(error);
      console.error("Réponse d'erreur (ajout) :", error.response);
      const message = error.response?.data?.message || "Erreur lors de l'ajout de la fiche de paie";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updatePayroll = async () => {
    if (!editingPayroll?.id) return;
    setLoading(true);
    try {
      const response = await PayrollService.updatePayroll(editingPayroll.id, editingPayroll);
      const message = response.data.message;
      toast.success(message);
      resetForm();
      await fetchPayrolls();
      document.getElementById("closeEditModal")?.click();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Erreur lors de la mise à jour de la fiche de paie";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (payroll) => {
    setEditingPayroll({ ...payroll });
  };

  const deletePayroll = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        setLoading(true);
        const response = await PayrollService.deletePayroll(id);
        const message = response.data.message;
        toast.success(message);
        await fetchPayrolls();
      } catch (error) {
        console.error(error);
        console.error("Réponse d'erreur (suppression) :", error.response);
        const message = error.response?.data?.message || "Erreur lors de la suppression de la fiche de paie";
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
                  <h5 className="m-b-10">Gérer les Fiches de Paie</h5>
                </div>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">Pages</li>
                  <li className="breadcrumb-item">Fiches de Paie</li>
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
                <h6>Liste des Fiches de Paie</h6>
                <button className="btn btn-primary d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#addModal">
                  <MdAdd className="me-2" /> Ajouter une Fiche de Paie
                </button>
              </div>
              <div className="card-body px-0 pt-0 pb-2">
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Début Période</th>
                        <th>Fin Période</th>
                        <th>Salaire Net</th>
                        <th>Employé ID</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrolls.length === 0 ? (
                        <tr><td colSpan="6">Aucune fiche de paie trouvée</td></tr>
                      ) : (
                        payrolls.map(payroll => (
                          <tr key={payroll.id}>
                            <td>{payroll.id}</td>
                            <td>{payroll.periodStart}</td>
                            <td>{payroll.periodEnd}</td>
                            <td>{payroll.netSalary}</td>
                            <td>{payroll.employee?.id || 'N/A'}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-warning me-2 d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => handleEditClick(payroll)}>
                                  <MdEdit className="me-1" /> Modifier
                                </button>
                                <button className="btn btn-sm btn-danger d-flex align-items-center" onClick={() => deletePayroll(payroll.id)}>
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
              <h5 className="modal-title" id="addModalLabel">Ajouter une fiche de paie</h5>
              <button type="button" className="btn-close" id="closeAddModal" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {renderPayrollForm(newPayroll, handleInputChange, false)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              <button type="button" className="btn btn-primary" onClick={addPayroll} disabled={loading}>
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
              <h5 className="modal-title" id="editModalLabel">Modifier une fiche de paie</h5>
              <button type="button" className="btn-close" id="closeEditModal" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {editingPayroll && renderPayrollForm(editingPayroll, handleInputChange, true)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              <button type="button" className="btn btn-primary" onClick={updatePayroll} disabled={loading}>
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant réutilisable pour le formulaire de fiche de paie
const renderPayrollForm = (payroll, handleChange, isEditing = false) => (
  <form>
    <div className="mb-3">
      <label className="form-label">Début de Période</label>
      <input
        type="date"
        className="form-control"
        name="periodStart"
        value={payroll.periodStart}
        onChange={(e) => handleChange(e, isEditing)}
        required
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Fin de Période</label>
      <input
        type="date"
        className="form-control"
        name="periodEnd"
        value={payroll.periodEnd}
        onChange={(e) => handleChange(e, isEditing)}
        required
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Salaire Net</label>
      <input
        type="number"
        className="form-control"
        name="netSalary"
        value={payroll.netSalary}
        onChange={(e) => handleChange(e, isEditing)}
        required
      />
    </div>
    <div className="mb-3">
      <label className="form-label">ID de l'Employé</label>
      <input
        type="number"
        className="form-control"
        name="employee"
        value={payroll.employee || ''}
        onChange={(e) => handleChange(e, isEditing)}
      />
    </div>
  </form>
);

export default Payroll;