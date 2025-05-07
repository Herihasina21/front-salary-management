import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PayrollService } from '../services/PayrollService';
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { EmployeeService } from "../services/EmployeeService.jsx";
import { BonusService } from '../services/BonusService.jsx'; 
import { DeductionService } from '../services/DeductionService.jsx'; 

const INITIAL_PAYROLL = {
  periodStart: '',
  periodEnd: '',
  employeeId: '',
  bonusId: [],
  deductionId: [],
};

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [newPayroll, setNewPayroll] = useState(INITIAL_PAYROLL);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [allBonuses, setAllBonuses] = useState([]);
  const [allDeductions, setAllDeductions] = useState([]);

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

  const fetchAllBonuses = async () => {
    try {
      setLoading(true);
      const response = await BonusService.getAllBonus(); // Correction ici (getAllBonus au singulier)
      setAllBonuses(response.data.data || []);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Erreur lors de la récupération des bonus";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDeductions = async () => {
    try {
      setLoading(true);
      const response = await DeductionService.getAllDeduction(); // Correction ici (getAllDeduction au singulier)
      setAllDeductions(response.data.data || []);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Erreur lors du chargement des déductions";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => { // Créer une fonction asynchrone pour gérer les appels
      await fetchPayrolls();
      await fetchEmployees();
      await fetchAllBonuses();
      await fetchAllDeductions();
    }
    fetchData();
  }, []);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));

    const updatePayrollState = (payroll) => {
      if (name === 'bonusId' || name === 'deductionId') {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        return { ...payroll, [name]: selectedOptions };
      }
      return { ...payroll, [name]: value === "" ? null : value };
    };

    if (isEditing) {
      setEditingPayroll(prev => updatePayrollState(prev));
    } else {
      setNewPayroll(prev => updatePayrollState(prev));
    }
  };

  const calculateNetSalary = (payroll, bonuses = [], deductions = []) => {
    // Find employee salary
    const employee = employees.find(emp => emp.id === payroll.employeeId);
    const baseSalary = employee?.salary?.baseSalary || 0;

    // Calculate total bonuses
    const totalBonus = bonuses
      .filter(bonus => payroll.bonusId.includes(bonus.id))
      .reduce((sum, bonus) => sum + bonus.amount, 0);

    // Calculate total deductions
    const totalDeduction = deductions
      .filter(deduction => payroll.deductionId.includes(deduction.id))
      .reduce((sum, deduction) => sum + deduction.amount, 0);

    return baseSalary + totalBonus - totalDeduction;
  };

  const validateForm = (payroll) => {
    let isValid = true;
    const newErrors = {};

    if (!payroll.periodStart) {
      newErrors.periodStart = 'La date de début de période est obligatoire.';
      isValid = false;
    }
    if (!payroll.periodEnd) {
      newErrors.periodEnd = 'La date de fin de période est obligatoire.';
      isValid = false;
    }
    if (!payroll.employeeId) {
      newErrors.employeeId = "L'employé est obligatoire.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setNewPayroll(INITIAL_PAYROLL);
    setEditingPayroll(null);
    setErrors({});
  };

  const addPayroll = async () => {
    if (!validateForm(newPayroll)) {
      return;
    }

    setLoading(true);
    try {
      const netSalary = calculateNetSalary(newPayroll, allBonuses, allDeductions);
      const payrollDataToSend = {
        ...newPayroll,
        netSalary: netSalary,
      };
      const response = await PayrollService.createPayroll(payrollDataToSend);
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
    if (!validateForm(editingPayroll)) {
      return;
    }
    setLoading(true);
    try {
      const netSalary = calculateNetSalary(editingPayroll, allBonuses, allDeductions);
      const payrollDataToSend = {
        ...editingPayroll,
        netSalary: netSalary,
      };
      const response = await PayrollService.updatePayroll(editingPayroll.id, payrollDataToSend);
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
    setEditingPayroll({
      ...payroll,
      bonusId: payroll.bonuses?.map(bonus => bonus.id) || [],
      deductionId: payroll.deductions?.map(deduction => deduction.id) || [],
      // netSalary: payroll.netSalary || 0, // Supprimé de la mise à jour de l'état
    });
    setErrors({});
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

  const renderPayrollForm = (payroll, handleChange, employees, isEditing = false, errors, allBonuses, allDeductions) => (
    <form>
      <div className="mb-3">
        <label className="form-label">Début de Période</label>
        <input
          type="date"
          className={`form-control ${errors.periodStart ? 'is-invalid' : ''}`}
          name="periodStart"
          value={payroll.periodStart}
          onChange={(e) => handleChange(e, isEditing)}
          required
        />
        {errors.periodStart && <div className="invalid-feedback">{errors.periodStart}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Fin de Période</label>
        <input
          type="date"
          className={`form-control ${errors.periodEnd ? 'is-invalid' : ''}`}
          name="periodEnd"
          value={payroll.periodEnd}
          onChange={(e) => handleChange(e, isEditing)}
          required
        />
        {errors.periodEnd && <div className="invalid-feedback">{errors.periodEnd}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Employé</label>
        <select
          className={`form-select ${errors.employeeId ? 'is-invalid' : ''}`}
          name="employeeId"
          value={payroll.employeeId}
          onChange={(e) => handleChange(e, isEditing)}
          required
        >
          <option value="">-- Sélectionner un employé --</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} {emp.firstName}</option>
          ))}
        </select>
        {errors.employeeId && <div className="invalid-feedback">{errors.employeeId}</div>}
      </div>

      {/* Bonus Select */}
      <div className="mb-3">
        <label className="form-label">Bonus</label>
        <select
          multiple
          className={`form-select ${errors.bonusId ? 'is-invalid' : ''}`}
          name="bonusId"
          value={payroll.bonusId || []}
          onChange={(e) => handleChange(e, isEditing)}
        >
          {allBonuses.map(bonus => (
            <option key={bonus.id} value={bonus.id}>{bonus.type} : {bonus.amount} Ar</option>
          ))}
        </select>
        {errors.bonusId && <div className="invalid-feedback">{errors.bonusId}</div>}
      </div>

      {/* Deductions Select */}
      <div className="mb-3">
        <label className="form-label">Déductions</label>
        <select
          multiple
          className={`form-select ${errors.deductionId ? 'is-invalid' : ''}`}
          name="deductionId"
          value={payroll.deductionId || []}
          onChange={(e) => handleChange(e, isEditing)}
        >
          {allDeductions.map(deduction => (
            <option key={deduction.id} value={deduction.id}>{deduction.type} : {deduction.amount} Ar</option>
          ))}
        </select>
        {errors.deductionId && <div className="invalid-feedback">{errors.deductionId}</div>}
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
              <div className="card-body">
                <div className="dt-responsive table-responsive">
                  <table className="table table-striped table-bordered nowrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Début Période</th>
                        <th>Fin Période</th>
                        <th>Employé</th>
                        <th>Salaire Net à Payer (Ar)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrolls.length === 0 ? (
                        <tr><td colSpan="6">Aucune fiche de paie trouvée</td></tr>
                      ) : (
                        payrolls.map(payroll => {
                          const employeeName = employees.find(emp => emp.id === payroll.employeeId)?.name || 'N/A';
                          return (
                            <tr key={payroll.id}>
                              <td>{payroll.id}</td>
                              <td>{payroll.periodStart}</td>
                              <td>{payroll.periodEnd}</td>
                              <td>{employeeName}</td>
                              <td>{payroll.netSalary}</td>
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
                          );
                        })
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
              {renderPayrollForm(newPayroll, handleInputChange, employees, false, errors, allBonuses, allDeductions)}
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
              {editingPayroll && renderPayrollForm(editingPayroll, handleInputChange, employees, true, errors, allBonuses, allDeductions)}
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

export default Payroll;