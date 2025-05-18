import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EmployeeService } from '../services/EmployeeService';
import { DepartmentService } from '../services/DepartmentService';
import { MdAdd } from "react-icons/md";
import Select from 'react-select';

const POSTE = [
  "Développeur",
  "Designer",
  "Chef de projet",
  "RH",
  "Comptable",
  "Autre"
];

const CONTRAT_TYPES = [
  "CDI",
  "CDD",
  "Stage",
  "Freelance",
  "Alternance",
  "Autre"
];

const contractTypeOptions = CONTRAT_TYPES.map(type => ({
  value: type,
  label: type
}));

const posteTypeOptions = POSTE.map(type => ({
  value: type,
  label: type
}));

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  const departmentOptions = departments.map(dep => ({ value: dep.id, label: dep.name }));

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
    let updatedValue = value;

    if (name === 'name' || name === 'firstName') {
      updatedValue = value.replace(/[0-9]/g, '');
    }
    if (name === 'phone') {
      updatedValue = value.replace(/[^\d]/g, '');
    }

    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));

    const updateEmployeeState = (employee) => {
      if (name === 'department') {
        const selectedDepartmentId = value === "" ? null : parseInt(value, 10);
        return {
          ...employee,
          department: selectedDepartmentId ? { id: selectedDepartmentId } : null,
        };
      } else {
        return { ...employee, [name]: updatedValue };
      }
    };

    if (isEditing) {
      setEditingEmployee(prev => updateEmployeeState(prev));
    } else {
      setNewEmployee(prev => updateEmployeeState(prev));
    }
  };

  const handleSelectChange = (selected, name, isEditing = false) => {
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    const updateEmployeeState = (employee) => ({ ...employee, [name]: selected ? selected.value : '' });

    if (isEditing) {
      setEditingEmployee(prev => updateEmployeeState(prev));
    } else {
      setNewEmployee(prev => updateEmployeeState(prev));
    }
  };

  const handleDepartmentSelectChange = (selected, isEditing = false) => {
    setErrors(prevErrors => ({ ...prevErrors, 'department': '' }));
    const updateEmployeeState = (employee) => ({ ...employee, department: selected ? { id: selected.value } : null });

    if (isEditing) {
      setEditingEmployee(prev => updateEmployeeState(prev));
    } else {
      setNewEmployee(prev => updateEmployeeState(prev));
    }
  };

  const VdtMalagasyPhone = (phone) => {
    if (!phone) return false;
    return /^0(2|3[2-8])\d{7}$/.test(phone);
  };

  const validateForm = (employee) => {
    let isValid = true;
    const newErrors = {};
    const errorFields = [];

    if (!employee.name.trim()) {
      newErrors.name = 'Le nom est obligatoire.';
      errorFields.push('Nom');
      isValid = false;
    }
    if (employee.name.match(/\d/)) {
      newErrors.name = 'Le nom ne doit pas contenir de chiffres.';
      if (!errorFields.includes('Nom')) errorFields.push('Nom');
      isValid = false;
    }
    if (!employee.firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire.';
      errorFields.push('Prénom');
      isValid = false;
    }
    if (employee.firstName.match(/\d/)) {
      newErrors.firstName = 'Le prénom ne doit pas contenir de chiffres.';
      if (!errorFields.includes('Prénom')) errorFields.push('Prénom');
      isValid = false;
    }
    if (!employee.email.trim()) {
      newErrors.email = "L'email est obligatoire.";
      errorFields.push('Email');
      isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|fr)$/.test(employee.email)) {
      newErrors.email = "L'email doit être au format valide (exemple@domaine.com, .org, .net, .fr...).";
      if (!errorFields.includes('Email')) errorFields.push('Email');
      isValid = false;
    }
    if (!employee.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est obligatoire.';
      errorFields.push('Téléphone');
      isValid = false;
    } else if (!/^\d+$/.test(employee.phone)) {
      newErrors.phone = 'Le numéro de téléphone doit contenir uniquement des chiffres.';
      if (!errorFields.includes('Téléphone')) errorFields.push('Téléphone');
      isValid = false;
    } else if (!VdtMalagasyPhone(employee.phone)) {
      newErrors.phone = 'Le numéro doit être un numéro valide (ex: 03X XX XXX XX)';
      if (!errorFields.includes('Téléphone')) errorFields.push('Téléphone');
      isValid = false;
    }
    if (!employee.address.trim()) {
      newErrors.address = "L'adresse est obligatoire.";
      errorFields.push('Adresse');
      isValid = false;
    }
    if (!employee.position) {
      newErrors.position = 'Le poste est obligatoire.';
      errorFields.push('Poste');
      isValid = false;
    }
    if (!employee.hireDate) {
      newErrors.hireDate = "La date d'embauche est obligatoire.";
      errorFields.push("Date d'embauche");
      isValid = false;
    }
    if (!employee.contractType) {
      newErrors.contractType = "Le type de contrat est obligatoire.";
      errorFields.push('Type de contrat');
      isValid = false;
    }
    if (!employee.department?.id) {
      newErrors.department = 'Le département est obligatoire.';
      errorFields.push('Département');
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, errorFields };
  };

  const resetForm = () => {
    setNewEmployee(INITIAL_EMPLOYEE);
    setEditingEmployee(null);
    setErrors({});
    setActiveTab('personal');
  };

  const addEmployee = async () => {
    const { isValid, errorFields } = validateForm(newEmployee);

    if (!isValid) {
      toast.error(
        `Veuillez corriger les erreurs dans les champs suivants: ${errorFields.join(', ')}`,
        { autoClose: 5000 }
      );
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
      setShowAddModal(false);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Erreur lors de l'ajout";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async () => {
    if (!editingEmployee?.id) return;

    const { isValid, errorFields } = validateForm(editingEmployee);

    if (!isValid) {
      toast.error(
        `Veuillez corriger les erreurs dans les champs suivants: ${errorFields.join(', ')}`,
        { autoClose: 5000 }
      );
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
      setShowEditModal(false);
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
    setShowEditModal(true);
    setActiveTab('personal');
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

  const handleNextTab = () => {
    // Valider seulement les champs de l'onglet personnel
    const personalFields = ['name', 'firstName', 'email', 'phone', 'address'];
    let hasErrors = false;
    const errorFields = [];
    const newErrors = {};

    const currentEmployee = showAddModal ? newEmployee : editingEmployee;

    personalFields.forEach(field => {
      if (!currentEmployee[field]?.trim()) {
        newErrors[field] = `Le champ ${field} est obligatoire.`;
        errorFields.push(
          field === 'name' ? 'Nom' :
            field === 'firstName' ? 'Prénom' :
              field === 'email' ? 'Email' :
                field === 'phone' ? 'Téléphone' : 'Adresse'
        );
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      toast.error(
        `Veuillez remplir tous les champs obligatoires: ${errorFields.join(', ')}`,
        { autoClose: 5000 }
      );
      return;
    }

    setActiveTab('job');
  };

  const handlePreviousTab = () => {
    setActiveTab('personal');
  };

  const filteredEmployees = employees.filter(emp => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(searchLower) ||
      emp.firstName.toLowerCase().includes(searchLower)
    );
  });

  const renderEmployeeForm = (employee, isEditing) => (
    <div>
      <ul className="nav nav-tabs" id="employeeTabs" role="tablist">
        <li className="nav-item flex-fill" role="presentation">
          <button
            className={`nav-link d-flex justify-content-between align-items-center w-100 active ${activeTab === 'personal' ? 'active' : ''}`}
            id="personal-tab"
            type="button"
            role="tab"
            onClick={() => setActiveTab('personal')}
          >
            <span>Informations personnelles</span>
            {errors.name || errors.firstName || errors.email || errors.phone || errors.address ? (
              <span className="badge bg-danger" style={{ fontSize: '0.7rem' }}>!</span>
            ) : null}
          </button>
        </li>
        <li className="nav-item flex-fill" role="presentation">
          <button
            className={`nav-link d-flex justify-content-between align-items-center w-100 ${activeTab === 'job' ? 'active' : ''}`}
            id="job-tab"
            type="button"
            role="tab"
            onClick={() => setActiveTab('job')}
          >
            <span>Informations professionnelles</span>
            {errors.position || errors.hireDate || errors.contractType || errors.department ? (
              <span className="badge bg-danger" style={{ fontSize: '0.7rem' }}>!</span>
            ) : null}
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3" id="employeeTabsContent">
        <div className={`tab-pane fade ${activeTab === 'personal' ? 'show active' : ''}`} id="personal" role="tabpanel">
          <div className="form-floating mb-3">
            <input
              type="text"
              id="floatingName"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Nom"
              value={employee.name}
              onChange={(e) => handleInputChange(e, isEditing)}
            />
            <label htmlFor="floatingName">Nom</label>
            {errors.name && (
              <div className="invalid-feedback d-block mt-1">{errors.name}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              id="floatingFirstName"
              name="firstName"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              placeholder="Prénom"
              value={employee.firstName}
              onChange={(e) => handleInputChange(e, isEditing)}
            />
            <label htmlFor="floatingFirstName">Prénom</label>
            {errors.firstName && (
              <div className="invalid-feedback d-block mt-1">{errors.firstName}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              id="floatingEmail"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Email"
              value={employee.email}
              onChange={(e) => handleInputChange(e, isEditing)}
            />
            <label htmlFor="floatingEmail">Email</label>
            {errors.email && (
              <div className="invalid-feedback d-block mt-1">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Téléphone</label>
            <div className="input-group">
              <span className="input-group-text bg-white p-2">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src="https://flagcdn.com/w20/mg.png"
                    alt="MG"
                    width="20"
                    className="rounded-1"
                  />
                </div>
              </span>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                name="phone"
                value={employee.phone}
                onChange={(e) => handleInputChange(e, isEditing)}
                placeholder="03X XX XXX XX"
                maxLength="10"
              />
            </div>
            {errors.phone && (
              <div className="invalid-feedback d-block mt-1">{errors.phone}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              id="floatingAddress"
              name="address"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              placeholder="Adresse"
              value={employee.address}
              onChange={(e) => handleInputChange(e, isEditing)}
            />
            <label htmlFor="floatingAddress">Adresse</label>
            {errors.address && (
              <div className="invalid-feedback d-block mt-1">{errors.address}</div>
            )}
          </div>
        </div>

        <div className={`tab-pane fade ${activeTab === 'job' ? 'show active' : ''}`} id="job" role="tabpanel">
          <div className="mb-3">
            <label className="form-label">Poste</label>
            <Select
              name="position"
              value={posteTypeOptions.find(opt => opt.value === employee.position) || null}
              onChange={selected => handleSelectChange(selected, 'position', isEditing)}
              options={posteTypeOptions}
              isClearable
              placeholder="-- Sélectionner --"
              className={errors.position ? 'is-invalid' : ''}
              classNamePrefix="react-select"
            />
            {errors.position && (
              <div className="invalid-feedback d-block">{errors.position}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Date d'embauche</label>
            <input
              type="date"
              className={`form-control ${errors.hireDate ? 'is-invalid' : ''}`}
              name="hireDate"
              value={employee.hireDate}
              onChange={(e) => handleInputChange(e, isEditing)}
            />
            {errors.hireDate && (
              <div className="invalid-feedback d-block">{errors.hireDate}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Type de contrat</label>
            <Select
              name="contractType"
              value={contractTypeOptions.find(opt => opt.value === employee.contractType) || null}
              onChange={(selected) => handleSelectChange(selected, 'contractType', isEditing)}
              options={contractTypeOptions}
              isClearable
              placeholder="-- Sélectionner --"
              className={errors.contractType ? 'is-invalid' : ''}
              classNamePrefix="react-select"
            />
            {errors.contractType && (
              <div className="invalid-feedback d-block">{errors.contractType}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Département</label>
            <Select
              name="department"
              value={
                departmentOptions.find(opt => opt.value === employee.department?.id) || null
              }
              onChange={(selected) => handleDepartmentSelectChange(selected, isEditing)}
              options={departmentOptions}
              isClearable
              placeholder="-- Sélectionner --"
              className={errors.department ? 'is-invalid' : ''}
              classNamePrefix="react-select"
            />
            {errors.department && (
              <div className="invalid-feedback d-block">{errors.department}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6>Liste des Employés ({filteredEmployees.length}/{employees.length})</h6>
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
                    onClick={() => setShowAddModal(true)}
                  >
                    <MdAdd className="me-2" /> Ajouter un Employé
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th width="50" className="border-start">ID</th>
                        <th>Nom complet et Email</th>
                        <th>Téléphone</th>
                        <th>Adresse</th>
                        <th>Poste</th>
                        <th>Date d'embauche</th>
                        <th>Type de contrat</th>
                        <th>Département</th>
                        <th width="120" className="border-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center py-4 border-start border-end">
                            {employees.length === 0 ? (
                              <div>
                                <p className="text-muted">Aucun employé enregistré</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-muted">Aucun résultat trouvé</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map(emp => (
                          <tr key={emp.id}>
                            <td className="border-start">{emp.id}</td>
                            <td>
                              <div className="fw-medium">{emp.name} {emp.firstName}</div>
                              <small className="text-muted">{emp.email}</small>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="d-flex align-items-center me-2">
                                  <img
                                    src="https://flagcdn.com/w20/mg.png"
                                    alt="MG"
                                    width="20"
                                    className="me-2"
                                  />
                                  <span>{emp.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td>{emp.address}</td>
                            <td>
                              <span className="badge bg-primary bg-opacity-10 text-primary">
                                {emp.position}
                              </span>
                            </td>
                            <td>{emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('fr-FR') : ''}</td>
                            <td>{emp.contractType}</td>
                            <td>{emp.department?.name}</td>
                            <td className="text-center border-end">
                              <ul className="me-auto mb-0" style={{ display: 'flex', flexDirection: 'row', paddingLeft: 0, listStyle: 'none', marginLeft: '-5px' }}>
                                <li className="align-bottom" style={{ marginRight: '10px' }}>
                                  <a className="avtar avtar-xs btn-link-primary"
                                    onClick={() => handleEditClick(emp)}
                                    style={{ cursor: 'pointer' }}>
                                    <i className="ti ti-edit-circle f-18"></i>
                                  </a>
                                </li>
                                <li className="align-bottom">
                                  <a className="avtar avtar-xs btn-link-danger"
                                    onClick={() => deleteEmployee(emp.id)}
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
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          aria-labelledby="addModalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addModalLabel">Ajouter un employé</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {renderEmployeeForm(newEmployee, false)}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Fermer
                </button>
                {activeTab === 'personal' ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextTab}
                  >
                    Suivant
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handlePreviousTab}
                    >
                      Précédent
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={addEmployee}
                      disabled={loading}
                    >
                      {loading ? 'Ajout en cours...' : 'Ajouter'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          aria-labelledby="editModalLabel"
          aria-hidden="false"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">Modifier un employé</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {editingEmployee && renderEmployeeForm(editingEmployee, true)}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Fermer
                </button>
                {activeTab === 'personal' ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextTab}
                  >
                    Suivant
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handlePreviousTab}
                    >
                      Précédent
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={updateEmployee}
                      disabled={loading}
                    >
                      {loading ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;