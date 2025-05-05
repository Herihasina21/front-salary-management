import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EmployeeService } from '../services/EmployeeService';
import { DepartmentService } from '../services/DepartmentService';
import { MdPersonAdd, MdEdit, MdDelete } from "react-icons/md";

const INITIAL_EMPLOYEE = {
  name: '',
  firstName: '',
  email: '',
  phone: '',
  address: '',
  position: '',
  hireDate: '',
  contractType: '',
  department: null
};

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState(INITIAL_EMPLOYEE);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await EmployeeService.getAllEmployees();
      setEmployees(response.data.data || []);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Erreur lors du chargement des employés";
      toast.error(message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await DepartmentService.getAllDepartments();
      setDepartments(response.data.data || []);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Erreur lors du chargement des départements";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;

    const updateEmployeeState = (employee) => {
      if (name === 'department') {
        const selectedDepartmentId = value === "" ? null : parseInt(value, 10);
        return {
          ...employee,
          department: selectedDepartmentId ? { id: selectedDepartmentId } : null,
        };
      } else {
        return { ...employee, [name]: value };
      }
    };

    if (isEditing) {
      setEditingEmployee(prev => updateEmployeeState(prev));
    } else {
      setNewEmployee(prev => updateEmployeeState(prev));
    }
  };

  const resetForm = () => {
    setNewEmployee(INITIAL_EMPLOYEE);
    setEditingEmployee(null);
  };

  const addEmployee = async () => {
    const { name, firstName, email, phone, address, position, hireDate, contractType, department } = newEmployee;
    if (!name || !firstName || !email || !phone || !address || !position || !hireDate || !contractType || !department?.name) {
      toast.error('Tous les champs sont obligatoires.');
      return;
    }

    setLoading(true);
    try {

      const dto = toEmployeeDTO(newEmployee);
      const response = await EmployeeService.createEmployee(dto);

      const message = response.data.message;
      toast.success(message);

      resetForm();
      await fetchEmployees();
      document.getElementById("closeAddModal")?.click();
    } catch (error) {
      console.error(error);
      console.error("Réponse d'erreur (ajout) :", error.response);
      const message = error.response?.data?.message || "Erreur lors de l'ajout";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async () => {
    if (!editingEmployee?.id) return;
    setLoading(true);
    try {

      const dto = toEmployeeDTO(editingEmployee);
      const response = await EmployeeService.updateEmployee(editingEmployee.id, dto);

      const message = response.data.message;
      toast.success(message);

      resetForm();
      await fetchEmployees();
      document.getElementById("closeEditModal")?.click();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee({ ...employee });
  };

  const deleteEmployee = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        const response = await EmployeeService.deleteEmployee(id);

        const message = response.data.message;
        toast.success(message);

        await fetchEmployees();
      } catch (error) {
        console.error(error);
        console.error("Réponse d'erreur (suppression) :", error.response);
        const message = error.response?.data?.message || "Erreur lors de la suppression";
        toast.error(message);
      }
    }
  };

  const toEmployeeDTO = (employee) => ({
    id: employee.id || null,
    name: employee.name,
    firstName: employee.firstName,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    position: employee.position,
    hireDate: employee.hireDate,
    contractType: employee.contractType,
    departmentID: employee.department?.id || null,
  });


  return (
    <div className="pc-container">
      <div className="pc-content">
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="page-header-title">
                  <h5 className="m-b-10">Gérer les employés</h5>
                </div>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">Pages</li>
                  <li className="breadcrumb-item">Employés</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6>Liste des Employés</h6>
                <button className="btn btn-primary d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#addModal">
                  <MdPersonAdd className="me-2" /> Ajouter un Employé
                </button>
              </div>
              <div className="card-body px-0 pt-0 pb-2">
                <div className="table-responsive p-0">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nom & Prénom(s)</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Adresse</th>
                        <th>Poste</th>
                        <th>Date d'embauche</th>
                        <th>Type de contrat</th>
                        <th>Département</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.length === 0 ? (
                        <tr><td colSpan="6">Aucun employé trouvé</td></tr>
                      ) : (
                        employees.map(emp => (
                          <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.name} {emp.firstName}</td>
                            <td>{emp.email}</td>
                            <td>{emp.phone}</td>
                            <td>{emp.address}</td>
                            <td>{emp.position}</td>
                            <td>{emp.hireDate}</td>
                            <td>{emp.contractType}</td>
                            <td>{emp.department?.name}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-warning me-2 d-flex align-items-center"
                                  data-bs-toggle="modal"
                                  data-bs-target="#editModal"
                                  onClick={() => handleEditClick(emp)}
                                >
                                  <MdEdit className="me-1" /> Modifier
                                </button>

                                <button
                                  className="btn btn-sm btn-danger d-flex align-items-center"
                                  onClick={() => deleteEmployee(emp.id)}
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
              <h5 className="modal-title" id="addModalLabel">Ajouter un employé</h5>
              <button type="button" className="btn-close" id="closeAddModal" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {renderEmployeeForm(newEmployee, handleInputChange, departments, false)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              <button type="button" className="btn btn-primary" onClick={addEmployee} disabled={loading}>
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
              <h5 className="modal-title" id="editModalLabel">Modifier un employé</h5>
              <button type="button" className="btn-close" id="closeEditModal" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {editingEmployee && renderEmployeeForm(editingEmployee, handleInputChange, departments, true)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              <button type="button" className="btn btn-primary" onClick={updateEmployee} disabled={loading}>
                {loading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderEmployeeForm = (employee, handleChange, departments, isEditing = false) => (
  <form>
    <div className="mb-3">
      <label className="form-label">Nom</label>
      <input
        type="text"
        className="form-control"
        name="name"
        value={employee.name}
        onChange={(e) => handleChange(e, isEditing)}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Prénom</label>
      <input
        type="text"
        className="form-control"
        name="firstName"
        value={employee.firstName}
        onChange={(e) => handleChange(e, isEditing)}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Email</label>
      <input
        type="email"
        className="form-control"
        name="email"
        value={employee.email}
        onChange={(e) => handleChange(e, isEditing)}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Téléphone</label>
      <input
        type="text"
        className="form-control"
        name="phone"
        value={employee.phone}
        onChange={(e) => handleChange(e, isEditing)}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Adresse</label>
      <input
        type="text"
        className="form-control"
        name="address"
        value={employee.address}
        onChange={(e) => handleChange(e, isEditing)}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Poste</label>
      <input
        type="text"
        className="form-control"
        name="position"
        value={employee.position}
        onChange={(e) => handleChange(e, isEditing)}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Date d'embauche</label>
      <input
        type="date"
        className="form-control"
        name="hireDate"
        value={employee.hireDate}
        onChange={(e) => handleChange(e, isEditing)}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Type de contrat</label>
      <input
        type="text"
        className="form-control"
        name="contractType"
        value={employee.contractType}
        onChange={(e) => handleChange(e, isEditing)}
      />
    </div>
    <div className="mb-3">
      <label className="form-label">Département</label>
      <select
        className="form-select"
        name="department"
        value={employee.department?.id || ''}
        onChange={(e) => handleChange(e, isEditing)}
      >
        <option value="">-- Sélectionner un département --</option>
        {departments.map(dep => (
          <option key={dep.id} value={dep.id}>{dep.name}</option>
        ))}
      </select>
    </div>
  </form>
);


export default Employee;
