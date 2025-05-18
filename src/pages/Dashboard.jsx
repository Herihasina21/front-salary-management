import React, { useEffect, useState } from 'react';
import { MdApartment, MdPeople, MdAttachMoney, MdAssignment, MdStar, MdRemoveCircleOutline } from "react-icons/md";
import { EmployeeService } from '../services/EmployeeService';
import { DepartmentService } from '../services/DepartmentService';
import { SalaryService } from '../services/SalaryService';
import { BonusService } from '../services/BonusService';
import { DeductionService } from '../services/DeductionService';
import { PayrollService } from '../services/PayrollService';
import { Box, Typography, styled, Card, CardContent, Container, useTheme } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: theme.shadows[3],
    transition: 'all 0.3s ease',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: theme.shadows[6],
    },
}));

const CardIcon = styled(Box)(({ theme, color }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? `${color}30` : `${color}20`,
    color: color,
    borderRadius: '50%',
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
}));

const StatsGrid = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
    },
}));

const statsConfig = [
    {
        label: "Départements",
        icon: <MdApartment size={24} />,
        stateKey: "totalDepartments",
        color: "grey.700"
    },
    {
        label: "Employés",
        icon: <MdPeople size={24} />,
        stateKey: "totalEmployes",
        color: "primary.main"
    },
    {
        label: "Salaires",
        icon: <MdAttachMoney size={24} />,
        stateKey: "totalSalaries",
        color: "success.main"
    },
    {
        label: "Bonus",
        icon: <MdStar size={24} />,
        stateKey: "totalBonus",
        color: "info.main"
    },
    {
        label: "Déductions",
        icon: <MdRemoveCircleOutline size={24} />,
        stateKey: "totalDeductions",
        color: "error.main"
    },
    {
        label: "Fiches de Paie",
        icon: <MdAssignment size={24} />,
        stateKey: "totalPayrolls",
        color: "secondary.main"
    },
];

function Dashboard() {
    const theme = useTheme();
    const [stats, setStats] = useState({
        totalEmployes: 0,
        totalDepartments: 0,
        totalSalaries: 0,
        totalBonus: 0,
        totalDeductions: 0,
        totalPayrolls: 0,
    });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [
                    employees, departments, salaries,
                    bonuses, deductions, payrolls
                ] = await Promise.all([
                    EmployeeService.getAllEmployees(),
                    DepartmentService.getAllDepartments(),
                    SalaryService.getAllSalary(),
                    BonusService.getAllBonus(),
                    DeductionService.getAllDeduction(),
                    PayrollService.getAllPayrolls()
                ]);

                setStats({
                    totalEmployes: employees.data.data?.length || 0,
                    totalDepartments: departments.data.data?.length || 0,
                    totalSalaries: salaries.data.data?.length || 0,
                    totalBonus: bonuses.data.data?.length || 0,
                    totalDeductions: deductions.data.data?.length || 0,
                    totalPayrolls: payrolls.data.data?.length || 0,
                });
            } catch (error) {
                console.error("Erreur lors du chargement des statistiques:", error);
            }
        };

        fetchAll();
    }, []);

    return (
        <div className="pc-container">
            <div className="pc-content">
                {/* Breadcrumb start */}
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
                {/* Breadcrumb end */}

                <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
                    <StatsGrid>
                        {statsConfig.map(({ label, icon, stateKey, color }, idx) => (
                            <StyledCard key={idx}>
                                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                        <Box>
                                            <Typography className="text-muted mb-1" component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                                                {`Total des ${label}`}
                                            </Typography>
                                            <Typography className="text-muted mb-1" variant="h6" sx={{ fontWeight: 800 }}>
                                                {stats[stateKey]}
                                            </Typography>
                                        </Box>
                                        <CardIcon color={theme.palette[color.split('.')[0]][color.split('.')[1]]}>
                                            {icon}
                                        </CardIcon>
                                    </Box>
                                </CardContent>
                            </StyledCard>
                        ))}
                    </StatsGrid>
                </Container>
            </div>
        </div>
    );
}

export default Dashboard;