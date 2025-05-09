import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, styled, keyframes, Card, CardContent, Grid } from '@mui/material';
import { TypeAnimation } from 'react-type-animation';
import { MdDashboard, MdApartment, MdPeople, MdAttachMoney, MdAssignment, MdStar, MdRemoveCircleOutline } from "react-icons/md";

const welcomeAnimation = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const AnimatedWelcome = styled(Typography)(({ theme }) => ({
  animation: `${welcomeAnimation} 1s ease-out forwards`,
  color: theme.palette.primary.main,
  fontWeight: 700,
  marginBottom: theme.spacing(2),
}));

const AnimatedCaption = styled(Typography)(({ theme }) => ({
  animation: `${welcomeAnimation} 1.5s ease-out forwards`,
  opacity: 0,
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

const MantisCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: 'transform 0.3s ease-in-out',
  height: '100%', 
  display: 'flex', 
  flexDirection: 'column', 
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const MantisCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  flexGrow: 1,
}));

const FeatureIcon = styled(Box)(({ theme, color }) => ({
  backgroundColor: color,
  color: theme.palette.common.white,
  borderRadius: '50%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

function Home() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting('Bonjour !');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Bon après-midi !');
    } else {
      setGreeting('Bonsoir !');
    }
  }, []);

  return (
    <div className="pc-container">
      <div className="pc-content">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', p: 4 }}>
          <AnimatedWelcome variant="h3" align="center">
            {greeting} Bienvenue chez <TypeAnimation
              sequence={[
                `[Nom de votre Société]`,
                1500,
                `votre plateforme de gestion salariale.`,
                1500,
              ]}
              speed={50}
              repeat={Infinity}
            />
          </AnimatedWelcome>

          <AnimatedCaption variant="subtitle1" align="center">
            Simplifiez l'administration de la paie et la gestion de vos employés. Découvrez nos fonctionnalités clés :
          </AnimatedCaption>

          <Grid container spacing={5} sx={{ maxWidth: 'md', width: '100%', mb: 3 }}>
            {[
              { icon: <MdDashboard size={32} />, title: "Tableau de Bord", description: "Visualisez les données clés.", color: "#9C27B0", path: "/dashboard" },
              { icon: <MdApartment size={32} />, title: "Gestion des Départements", description: "Organisez votre structure.", color: "#FFC107", path: "/department" },
              { icon: <MdPeople size={32} />, title: "Gestion des Employés", description: "Gérez vos employés efficacement.", color: "#2196F3", path: "/employes" },
              { icon: <MdAttachMoney size={32} />, title: "Gestion des Salaires", description: "Simplifiez la gestion de la paie.", color: "#4CAF50", path: "/salary" },
              { icon: <MdStar size={32} />, title: "Gestion des Bonus", description: "Récompensez vos employés.", color: "#FF9800", path: "/bonus" },
              { icon: <MdRemoveCircleOutline size={32} />, title: "Gestion des Déductions", description: "Gérez les retenues sur salaire.", color: "#F44336", path: "/deduction" },
              { icon: <MdAssignment size={32} />, title: "Fiches de Paie", description: "Générez les bulletins de salaire.", color: "#673AB7", path: "/payroll" },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}> {/* Ajout de display: 'flex' */}
                <Link to={item.path} style={{ textDecoration: 'none', width: '100%' }}>
                  <MantisCard>
                    <MantisCardContent>
                      <FeatureIcon color={item.color}>
                        {item.icon}
                      </FeatureIcon>
                      <Typography variant="h6" gutterBottom align="center" sx={{ minHeight: '64px', display: 'flex', alignItems: 'center' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" align="center">
                        {item.description}
                      </Typography>
                    </MantisCardContent>
                  </MantisCard>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </div>
  );
}

export default Home;