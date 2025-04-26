import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '', firstName: '', email: '', phone: '', address: '',
    position: '', hireDate: '', contractType: '', department: { name: '' }
  });
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:8080/api/employees')
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Erreur lors de la récupération des employés :', error));
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;

    if (name.startsWith('department.')) {
      const departmentName = value;
      if (isEditing) {
        setEditingEmployee(prev => ({ ...prev, department: { ...prev.department, name: departmentName } }));
      } else {
        setNewEmployee(prev => ({ ...prev, department: { ...prev.department, name: departmentName } }));
      }
    } else {
      if (isEditing) {
        setEditingEmployee(prev => ({ ...prev, [name]: value }));
      } else {
        setNewEmployee(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const addEmployee = () => {
    axios.post('http://localhost:8080/api/employees', newEmployee)
      .then(() => {
        fetchEmployees();
        resetNewEmployee();
        document.getElementById('closeAddModal').click();
      })
      .catch(error => console.error('Erreur lors de l\'ajout de l\'employé :', error));
  };

  const updateEmployee = () => {
    axios.put(`http://localhost:8080/api/employees/${editingEmployee.id}`, editingEmployee)
      .then(() => {
        fetchEmployees();
        setEditingEmployee(null);
        document.getElementById('closeEditModal').click();
      })
      .catch(error => console.error('Erreur lors de la mise à jour de l\'employé :', error));
  };

  const deleteEmployee = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      axios.delete(`http://localhost:8080/api/employees/${id}`)
        .then(() => fetchEmployees())
        .catch(error => console.error('Erreur lors de la suppression de l\'employé :', error));
    }
  };

  const resetNewEmployee = () => {
    setNewEmployee({
      name: '', firstName: '', email: '', phone: '', address: '',
      position: '', hireDate: '', contractType: '', department: { name: '' }
    });
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card mb-4">
          <div className="card-header pb-0 d-flex justify-content-between align-items-center">
            <h6>Liste des Employés</h6>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addEmployeeModal">
              Ajouter Employé
            </button>
          </div>
          <div className="card-body px-0 pt-0 pb-2">
            <div className="table-responsive p-0">
              <table className="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th>Nom et prénom(s)</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Adresse</th>
                    <th>Position</th>
                    <th>Date d'embauche</th>
                    <th>Type de contrat</th>
                    <th>Département</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.name} {emp.firstName}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.address}</td>
                      <td>{emp.position}</td>
                      <td>{emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : ''}</td>
                      <td>{emp.contractType}</td>
                      <td>{emp.department ? emp.department.name : 'N/A'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setEditingEmployee(emp)}
                          data-bs-toggle="modal"
                          data-bs-target="#editEmployeeModal"
                        >
                          Modifier
                        </button>
                        <button
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() => deleteEmployee(emp.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center">Aucun employé trouvé</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ajouter Employé */}
      <div className="modal fade" id="addEmployeeModal" tabIndex="-1" aria-labelledby="addEmployeeModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addEmployeeModalLabel">Ajouter un Employé</h5>
              <button id="closeAddModal" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {renderEmployeeForm(newEmployee, handleInputChange)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={addEmployee}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Modifier Employé */}
      {editingEmployee && (
        <div className="modal fade" id="editEmployeeModal" tabIndex="-1" aria-labelledby="editEmployeeModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editEmployeeModalLabel">Modifier l'Employé</h5>
                <button id="closeEditModal" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {renderEmployeeForm(editingEmployee, (e) => handleInputChange(e, true))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                <button type="button" className="btn btn-success" onClick={updateEmployee}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Formulaire d'employé (Réutilisable)
function renderEmployeeForm(employee, onChange) {
  return (
    <>
      <input className="form-control mb-2" placeholder="Nom" name="name" value={employee.name} onChange={onChange} />
      <input className="form-control mb-2" placeholder="Prénom(s)" name="firstName" value={employee.firstName} onChange={onChange} />
      <input className="form-control mb-2" placeholder="Email" name="email" value={employee.email} onChange={onChange} />
      <input className="form-control mb-2" placeholder="Téléphone" name="phone" value={employee.phone} onChange={onChange} />
      <input className="form-control mb-2" placeholder="Adresse" name="address" value={employee.address} onChange={onChange} />
      <input className="form-control mb-2" placeholder="Position" name="position" value={employee.position} onChange={onChange} />
      <input className="form-control mb-2" placeholder="Date d'embauche" type="date" name="hireDate" value={employee.hireDate} onChange={onChange} />
      <input className="form-control mb-2" placeholder="Type de contrat" name="contractType" value={employee.contractType} onChange={onChange} />
      <input className="form-control mb-2" placeholder="Département" name="department.name" value={employee.department?.name || ''} onChange={onChange} />
    </>
  );
}
