import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, styled, keyframes, Card, CardContent, Container, Tooltip, useTheme } from '@mui/material';
import { TypeAnimation } from 'react-type-animation';
import { MdApartment, MdPeople, MdAttachMoney, MdAssignment, MdStar, MdRemoveCircleOutline } from "react-icons/md";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedTitle = styled(Typography)(({ theme }) => ({
  animation: `${fadeIn} 1s ease-out`,
  fontWeight: 800,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
}));

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

const FeatureGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '24px',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

function Home() {
  const theme = useTheme();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Bonjour !');
    else if (hour >= 12 && hour < 18) setGreeting('Bon après-midi !');
    else setGreeting('Bonsoir !');
  }, []);

  const features = [
    {
      icon: <MdApartment size={24} />,
      title: "Gérer les Départements",
      description: "Ajoutez, modifiez ou supprimez les département.",
      color: theme.palette.grey[700],
      path: "/department"
    },
    {
      icon: <MdPeople size={24} />,
      title: "Superviser les Employés",
      description: "Gérez les profils et infos des collaborateurs.",
      color: theme.palette.primary.main,
      path: "/employes"
    },
    {
      icon: <MdAttachMoney size={24} />,
      title: "Gestion des Salaires",
      description: "Créez et gérez les salaires par employé.",
      color: theme.palette.success.main,
      path: "/salary"
    },
    {
      icon: <MdStar size={24} />,
      title: "Attribuer des Bonus",
      description: "Ajoutez ou retirez des primes facilement.",
      color: theme.palette.info.main,
      path: "/bonus"
    },
    {
      icon: <MdRemoveCircleOutline size={24} />,
      title: "Appliquer des Déductions",
      description: "Gérez facilement les retenues salariales.",
      color: theme.palette.error.main,
      path: "/deduction"
    },
    {
      icon: <MdAssignment size={24} />,
      title: "Éditer les Fiches de Paie",
      description: "Générez, téléchargez et envoyez les bulletins.",
      color: theme.palette.secondary.main,
      path: "/payroll"
    }
  ];

  return (
    <div className="pc-container">
      <div className="pc-content">
        <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
          <Box textAlign="center" mb={6}>
            <AnimatedTitle variant="h3" component="h1">
              {greeting} Bienvenue sur{' '}
              <TypeAnimation
                sequence={["Izy M'Lay Entreprise", 5000, "votre solution de gestion des salaires et de la paie", 5000]}
                speed={50}
                repeat={Infinity}
                style={{ color: theme.palette.primary.dark }}
              />
            </AnimatedTitle>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', margin: '0 auto' }}>
              Supervisez vos employés, maîtrisez la paie, et gardez le contrôle sur l'ensemble des opérations RH.
            </Typography>
          </Box>

          <FeatureGrid>
            {features.map((item, index) => (
              <div key={index}>
                <Link to={item.path} style={{ textDecoration: 'none' }}>
                  <Tooltip title={`Cliquez pour accéder à ${item.title}`} arrow>
                    <StyledCard>
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
                          <Box>
                            <Typography className="text-muted mb-1" component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          </Box>
                          <CardIcon color={item.color}>
                            {item.icon}
                          </CardIcon>
                        </Box>
                        <Box sx={{ mt: 'auto', pt: 2 }}>
                          <Typography
                            variant="caption"
                            color="primary"
                            sx={{
                              fontWeight: 600,
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            Accéder →
                          </Typography>
                        </Box>
                      </CardContent>
                    </StyledCard>
                  </Tooltip>
                </Link>
              </div>
            ))}
          </FeatureGrid>
        </Container>
      </div>
    </div>
  );
}

export default Home;