import React, { useEffect, useState } from 'react';
import { MdApartment, MdPeople, MdAttachMoney, MdAssignment, MdStar, MdRemoveCircleOutline } from "react-icons/md";
import { EmployeeService } from '../services/EmployeeService';
import { DepartmentService } from '../services/DepartmentService';
import { SalaryService } from '../services/SalaryService';
import { BonusService } from '../services/BonusService';
import { DeductionService } from '../services/DeductionService';
import { PayrollService } from '../services/PayrollService';

function Dashboard() {
    const [totalEmployes, setTotalEmployes] = useState(0);
    const [totalDepartments, setTotalDepartments] = useState(0);
    const [totalSalaries, setTotalSalaries] = useState(0);
    const [totalBonus, setTotalBonus] = useState(0);
    const [totalDeductions, setTotalDeductions] = useState(0);
    const [totalPayrolls, setTotalPayrolls] = useState(0);

    useEffect(() => {
        const fetchEmployeesCount = async () => {
            const response = await EmployeeService.getAllEmployees();
            setTotalEmployes(response.data.data?.length || 0);
        };

        const fetchDepartmentsCount = async () => {
            const response = await DepartmentService.getAllDepartments();
            setTotalDepartments(response.data.data?.length || 0);
        };

        const fecthSalariesCount = async () => {
            const response = await SalaryService.getAllSalary();
            setTotalSalaries(response.data.data?.length || 0);
        };

        const fecthBonusCount = async () => {
            const response = await BonusService.getAllBonus();
            setTotalBonus(response.data.data?.length || 0);
        };

        const fecthDeductionsCount = async () => {
            const response = await DeductionService.getAllDeduction();
            setTotalDeductions(response.data.data?.length || 0);
        };

        const fecthPayrollsCount = async () => {
            const response = await PayrollService.getAllPayrolls();
            setTotalPayrolls(response.data.data?.length || 0);
        };

        fetchEmployeesCount();
        fetchDepartmentsCount();
        fecthSalariesCount();
        fecthBonusCount();
        fecthDeductionsCount();
        fecthPayrollsCount();
    }, []);

    return (
        <div className="pc-container">
            <div className="pc-content">
                {/* [ breadcrumb ] start */}
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <div className="page-header-title">
                                    <h5 className="m-b-10">Statistiques Générales</h5>
                                </div>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">Pages</li>
                                    <li className="breadcrumb-item">Tableau de bord</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* [ breadcrumb ] end */}

                {/* [ Main Content ] start */}
                <div className="row">
                    <div className="col-xl-4 col-md-12">
                        <div className="card comp-card">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h5 className="m-b-20">Total des Départements</h5>
                                        <h3>{totalDepartments}</h3>
                                    </div>
                                    <div className="col-auto">
                                        <div className="bg-light-primary text-primary" style={{ borderRadius: '5px', padding: '2px', fontSize: '40px' }}>
                                            <MdApartment />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-12">
                        <div className="card comp-card">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h5 className="m-b-20">Total des Employés</h5>
                                        <h3>{totalEmployes}</h3>
                                    </div>
                                    <div className="col-auto">
                                        <div className="bg-light-primary text-primary" style={{ borderRadius: '5px', padding: '2px', fontSize: '40px' }}>
                                            <MdPeople />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-12">
                        <div className="card comp-card">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h5 className="m-b-20">Total des Salaires</h5>
                                        <h3>{totalSalaries}</h3>
                                    </div>
                                    <div className="col-auto">
                                        <div className="bg-light-primary text-primary" style={{ borderRadius: '5px', padding: '2px', fontSize: '40px' }}>
                                            <MdAttachMoney />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-12">
                        <div className="card comp-card">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h5 className="m-b-20">Total des Bonus</h5>
                                        <h3>{totalBonus}</h3>
                                    </div>
                                    <div className="col-auto">
                                        <div className="bg-light-primary text-primary" style={{ borderRadius: '5px', padding: '2px', fontSize: '40px' }}>
                                            <MdStar />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-12">
                        <div className="card comp-card">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h5 className="m-b-20">Total des Déductions</h5>
                                        <h3>{totalDeductions}</h3>
                                    </div>
                                    <div className="col-auto">
                                        <div className="bg-light-primary text-primary" style={{ borderRadius: '5px', padding: '2px', fontSize: '40px' }}>
                                            <MdRemoveCircleOutline />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-12">
                        <div className="card comp-card">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col">
                                        <h5 className="m-b-20">Total des Fiches de Paie</h5>
                                        <h3>{totalPayrolls}</h3>
                                    </div>
                                    <div className="col-auto">
                                        <div className="bg-light-primary text-primary" style={{ borderRadius: '5px', padding: '2px', fontSize: '40px' }}>
                                            <MdAssignment />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* [ Main Content ] end */}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;