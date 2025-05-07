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
  const [errors, setErrors] = useState({});

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
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));

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

  const validateForm = (employee) => {
    let isValid = true;
    const newErrors = {};

    if (!employee.name.trim()) {
      newErrors.name = 'Le nom est obligatoire.';
      isValid = false;
    }
    if (!employee.firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire.';
      isValid = false;
    }
    if (!employee.email.trim()) {
      newErrors.email = "L'email est obligatoire.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(employee.email)) {
      newErrors.email = "L'email n'est pas valide.";
      isValid = false;
    }
    if (!employee.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est obligatoire.';
      isValid = false;
    } else if (!/^\d+$/.test(employee.phone)) {
      newErrors.phone = 'Le numéro de téléphone doit contenir uniquement des chiffres.';
      isValid = false;
    }
    if (!employee.address.trim()) {
      newErrors.address = "L'adresse est obligatoire.";
      isValid = false;
    }
    if (!employee.position.trim()) {
      newErrors.position = 'Le poste est obligatoire.';
      isValid = false;
    }
    if (!employee.hireDate) {
      newErrors.hireDate = "La date d'embauche est obligatoire.";
      isValid = false;
    }
    if (!employee.contractType.trim()) {
      newErrors.contractType = "Le type de contrat est obligatoire.";
      isValid = false;
    }
    if (!employee.department?.id) {
      newErrors.department = 'Le département est obligatoire.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setNewEmployee(INITIAL_EMPLOYEE);
    setEditingEmployee(null);
    setErrors({});
  };

  const addEmployee = async () => {
    if (!validateForm(newEmployee)) {
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
    if (!validateForm(editingEmployee)) {
      return;
    }
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
    setErrors({});
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
              <div className="card-body">
                <div className="dt-responsive table-responsive">
                  <table className="table table-striped table-bordered nowrap">
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
              {renderEmployeeForm(newEmployee, handleInputChange, departments, false, errors)}
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
              {editingEmployee && renderEmployeeForm(editingEmployee, handleInputChange, departments, true, errors)}
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

const renderEmployeeForm = (employee, handleChange, departments, isEditing, errors) => (
  <div>
    {/* Onglets */}
    <ul className="nav nav-tabs" id="employeeTabs" role="tablist">
      <li className="nav-item" role="presentation">
        <button className="nav-link active" id="personal-tab" data-bs-toggle="tab" data-bs-target="#personal" type="button" role="tab">
          Informations personnelles
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button className="nav-link" id="job-tab" data-bs-toggle="tab" data-bs-target="#job" type="button" role="tab">
          Informations professionnelles
        </button>
      </li>
    </ul>

    {/* Contenu des onglets */}
    <div className="tab-content mt-3" id="employeeTabsContent">
      {/* Onglet personnel */}
      <div className="tab-pane fade show active" id="personal" role="tabpanel">
        <div className="form-floating mb-3">
          <input
            type="text"
            id="floatingName"
            name="name"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            placeholder="Nom"
            value={employee.name}
            onChange={(e) => handleChange(e, isEditing)}
          />
          <label htmlFor="floatingName">Nom</label>
        </div>
        {errors.name && (
          <div className="invalid-feedback d-block mt-1">{errors.name}</div>
        )}

        <div className="form-floating mb-3">
          <input
            type="text"
            id="floatingFirstName"
            name="firstName"
            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            placeholder="Prénom"
            value={employee.firstName}
            onChange={(e) => handleChange(e, isEditing)}
          />
          <label htmlFor="floatingFirstName">Prénom</label>
        </div>
        {errors.firstName && (
          <div className="invalid-feedback d-block mt-1">{errors.firstName}</div>
        )}

        <div className="form-floating mb-3">
          <input
            type="email"
            id="floatingEmail"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="Email"
            value={employee.email}
            onChange={(e) => handleChange(e, isEditing)}
          />
          <label htmlFor="floatingEmail">Email</label>
        </div>
        {errors.email && (
          <div className="invalid-feedback d-block mt-1">{errors.email}</div>
        )}

        <div className="form-floating mb-3">
          <input
            type="text"
            id="floatingPhone"
            name="phone"
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            placeholder="Téléphone"
            value={employee.phone}
            onChange={(e) => handleChange(e, isEditing)}
          />
          <label htmlFor="floatingPhone">Téléphone</label>
        </div>
        {errors.phone && (
          <div className="invalid-feedback d-block mt-1">{errors.phone}</div>
        )}

        <div className="form-floating mb-3">
          <input
            type="text"
            id="floatingAddress"
            name="address"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            placeholder="Adresse"
            value={employee.address}
            onChange={(e) => handleChange(e, isEditing)}
          />
          <label htmlFor="floatingAddress">Adresse</label>
        </div>
        {errors.address && (
          <div className="invalid-feedback d-block mt-1">{errors.address}</div>
        )}
      </div>

      {/* Onglet professionnel */}
      <div className="tab-pane fade" id="job" role="tabpanel">
        <div className={`mb-3 ${errors.position ? 'form-group position-relative' : ''}`}>
          <label className="form-label">Poste</label>
          <select
            name="position"
            className={`form-select ${errors.position ? 'is-invalid' : ''}`}
            value={employee.position}
            onChange={(e) => handleChange(e, isEditing)}
          >
            <option value="">-- Sélectionner --</option>
            <option value="Développeur">Développeur</option>
            <option value="Designer">Designer</option>
            <option value="Chef de projet">Chef de projet</option>
            <option value="RH">RH</option>
            <option value="Comptable">Comptable</option>
          </select>
          {errors.position && (
            <div className="invalid-feedback">{errors.position}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Date d'embauche</label>
          <input
            type="date"
            className={`form-control ${errors.hireDate ? 'is-invalid' : ''}`}
            name="hireDate"
            value={employee.hireDate}
            onChange={(e) => handleChange(e, isEditing)}
          />
          {errors.hireDate && (
            <div className="invalid-feedback" style={{ position: 'absolute' }}>{errors.hireDate}</div>
          )}
        </div>

        <div className={`mb-3 ${errors.contractType ? 'form-group position-relative' : ''}`}>
          <label className="form-label">Type de contrat</label>
          <select
            name="contractType"
            className={`form-select ${errors.contractType ? 'is-invalid' : ''}`}
            value={employee.contractType}
            onChange={(e) => handleChange(e, isEditing)}
          >
            <option value="">-- Sélectionner --</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Freelance">Freelance</option>
            <option value="Alternance">Alternance</option>
          </select>
          {errors.contractType && (
            <div className="invalid-feedback">{errors.contractType}</div>
          )}
        </div>

        <div className={`mb-3 ${errors.department ? 'form-group position-relative' : ''}`}>
          <label className="form-label">Département</label>
          <select
            className={`form-select ${errors.department ? 'is-invalid' : ''}`}
            name="department"
            value={employee.department?.id || ""}
            onChange={(e) => handleChange(e, isEditing)}
          >
            <option value="">-- Sélectionner --</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>{dep.name}</option>
            ))}
          </select>
          {errors.department && (
            <div className="invalid-feedback">{errors.department}</div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default Employee;
