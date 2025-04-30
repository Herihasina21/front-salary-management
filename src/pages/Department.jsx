import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { DepartmentService } from '../services/DepartmentService';
import { MdEdit, MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

const INITIAL_DEPARTMENT = {
  name: '',
  code: '',
};

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState(INITIAL_DEPARTMENT);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      const response = await DepartmentService.getAllDepartments();
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Erreur lors du chargement des départements';
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    const updatedDepartment = isEditing ? { ...editingDepartment, [name]: value } : { ...newDepartment, [name]: value };

    if (isEditing) {
      setEditingDepartment(updatedDepartment);
    } else {
      setNewDepartment(updatedDepartment);
    }
  };

  const resetForm = () => {
    setNewDepartment(INITIAL_DEPARTMENT);
    setEditingDepartment(null);
  };

  const addDepartment = async () => {
    if (!newDepartment.name || !newDepartment.code) {
      toast.error('Le nom et le code du département sont requis.');
      return;
    }

    setLoading(true);

    try {
      const response = await DepartmentService.createDepartment(newDepartment);
      toast.success(response.data.message);
      resetForm();
      await fetchDepartments();
      document.getElementById('closeAddModal')?.click();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Erreur lors de l\'ajout du département';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async () => {
    if (!editingDepartment?.name || !editingDepartment?.code) {
      toast.error('Le nom et le code du département sont requis.');
      return;
    }

    setLoading(true);

    try {
      const response = await DepartmentService.updateDepartment(editingDepartment.id, editingDepartment);
      toast.success(response.data.message);
      resetForm();
      await fetchDepartments();
      document.getElementById('closeEditModal')?.click();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour du département';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      setLoading(true);

      try {
        const response = await DepartmentService.deleteDepartment(id);
        toast.success(response.data.message); // Afficher le message de succès
        await fetchDepartments();
      } catch (error) {
        console.error(error);
        const message = error.response?.data?.message || 'Erreur lors de la suppression du département';
        toast.error(message); // Afficher le message d'erreur spécifique du backend
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditClick = (department) => {
    setEditingDepartment({ ...department });
  };

  const renderDepartmentForm = (department, handleChange, isEditing = false) => (
    <form>
      <div className="mb-3">
        <label className="form-label">Nom du département</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={department.name}
          onChange={(e) => handleChange(e, isEditing)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Code du département</label>
        <input
          type="text"
          className="form-control"
          name="code"
          value={department.code}
          onChange={(e) => handleChange(e, isEditing)}
        />
      </div>
    </form>
  );

  return (
    <div className="pc-container">
      <div className="pc-content">
        {/* [ breadcrumb ] start */}
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="page-header-title">
                  <h5 className="m-b-10">Gérer les départements</h5>
                </div>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">Pages</li>
                  <li className="breadcrumb-item">Départements</li>
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
                <h6>Liste des Départements</h6>
                <button className="btn btn-primary d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#addModal">
                  <FaPlus className="me-2" /> Ajouter un Département
                </button>
              </div>
              <div className="card-body px-0 pt-0 pb-2">
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nom du Département</th>
                        <th>Code du Département</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.length === 0 ? (
                        <tr><td colSpan="4">Aucun département trouvé</td></tr>
                      ) : (
                        departments.map(dept => (
                          <tr key={dept.id}>
                            <td>{dept.id}</td>
                            <td>{dept.name}</td>
                            <td>{dept.code}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-warning me-2 d-flex align-items-center"
                                  data-bs-toggle="modal"
                                  data-bs-target="#editModal"
                                  onClick={() => handleEditClick(dept)}
                                >
                                  <MdEdit className="me-1" /> Modifier
                                </button>
                                <button
                                  className="btn btn-sm btn-danger d-flex align-items-center"
                                  onClick={() => deleteDepartment(dept.id)}
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
      <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addModalLabel">Ajouter un département</h5>
              <button type="button" className="btn-close" id="closeAddModal" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
            </div>
            <div className="modal-body">
              {renderDepartmentForm(newDepartment, handleInputChange)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              <button type="button" className="btn btn-primary" onClick={addDepartment} disabled={loading}>
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
              <h5 className="modal-title" id="editModalLabel">Modifier un département</h5>
              <button type="button" className="btn-close" id="closeEditModal" data-bs-dismiss="modal" aria-label="Close" onClick={resetForm}></button>
            </div>
            <div className="modal-body">
              {editingDepartment && renderDepartmentForm(editingDepartment, handleInputChange, true)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              <button type="button" className="btn btn-primary" onClick={updateDepartment} disabled={loading}>
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;