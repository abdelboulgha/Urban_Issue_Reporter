import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Fade,
  Grow,
  useMediaQuery,
  useTheme
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BarChartIcon from "@mui/icons-material/BarChart";
import SecurityIcon from "@mui/icons-material/Security";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const featuresRef = useRef(null);
  const topRef = useRef(null);
  const ctaRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Références pour toutes les sections principales
  const sections = [
    { ref: topRef, id: "top" },
    { ref: featuresRef, id: "features" },
    { ref: ctaRef, id: "cta" }
  ];

  useEffect(() => {
    document.body.style.overflowY = "scroll";
    document.body.classList.add("scroll-content-min-height");
    document.body.classList.add("smooth-scroll");
    
    // Add slight delay to improve animation effect
    const loadTimer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    window.scrollTo(0, 0);

    const handleScroll = () => {
      // Gérer le bouton retour en haut
      setShowBackToTop(window.scrollY > 300);
      
      // Calculer la progression du défilement
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);
      
      // Déterminer la section active
      const viewportMiddle = scrollTop + (windowHeight / 2);
      
      // Trouver la section active en fonction de la position de défilement
      let activeIndex = 0;
      sections.forEach((section, index) => {
        if (section.ref.current) {
          const sectionTop = section.ref.current.offsetTop;
          const sectionHeight = section.ref.current.offsetHeight;
          
          if (viewportMiddle >= sectionTop && viewportMiddle <= sectionTop + sectionHeight) {
            activeIndex = index;
          }
        }
      });
      
      setActiveSection(activeIndex);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.body.style.overflowY = "";
      document.body.classList.remove("scroll-content-min-height");
      document.body.classList.remove("smooth-scroll");
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(loadTimer);
    };
  }, []);

  const navigateToLogin = () => {
    navigate("/login");
  };

  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
  };

  const scrollToFeatures = () => scrollToSection(featuresRef);
  const scrollToCta = () => scrollToSection(ctaRef);
  const scrollToTop = () => scrollToSection(topRef);

  const features = [
    {
      icon: <AssignmentTurnedInIcon className="feature-icon" />,
      title: "Gestion centralisée",
      desc: "Centralisez toutes vos réclamations dans une interface unique et intuitive pour un suivi simplifié"
    },
    {
      icon: <BarChartIcon className="feature-icon" />,
      title: "Analyses avancées",
      desc: "Accédez à des tableaux de bord détaillés et des statistiques en temps réel pour prendre de meilleures décisions"
    },
    {
      icon: <SecurityIcon className="feature-icon" />,
      title: "Sécurité optimale",
      desc: "Vos données sont protégées avec les plus hauts standards de sécurité et de confidentialité"
    },
    {
      icon: <AccessTimeIcon className="feature-icon" />,
      title: "Suivi en temps réel",
      desc: "Suivez l'état d'avancement de chaque réclamation avec des mises à jour instantanées"
    },
    {
      icon: <SupportAgentIcon className="feature-icon" />,
      title: "Support dédié",
      desc: "Bénéficiez d'une assistance personnalisée pour résoudre rapidement vos problèmes"
    },
    {
      icon: <NotificationsActiveIcon className="feature-icon" />,
      title: "Alertes et notifications",
      desc: "Restez informé des mises à jour importantes grâce à notre système d'alertes personnalisables"
    }
  ];

  return (
    <div className="welcome-container" ref={topRef}>
      <div className="animated-background"></div>
      
      {/* Barre de progression du défilement */}
      <div className="scroll-progress-container">
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      
      {/* Indicateurs de défilement latéraux */}
      <div className="scroll-indicator-container">
        {sections.map((section, index) => (
          <div 
            key={section.id}
            className={`scroll-indicator-dot ${activeSection === index ? 'active' : ''}`}
            onClick={() => scrollToSection(section.ref)}
            title={section.id === "top" ? "Accueil" : section.id === "features" ? "Fonctionnalités" : "Commencer"}
          ></div>
        ))}
      </div>

      <Container maxWidth="lg" className="welcome-content">
        <Fade in={loaded} timeout={1000}>
          <Box className="header-section">
            <Box className="logo-container">
              <Box className="logo-icon">
                <AssignmentTurnedInIcon fontSize="large" />
              </Box>
              <Typography variant="h2" className="app-title">
                ReclamExpress
              </Typography>
            </Box>
            <Typography variant="h5" className="app-subtitle">
              Plateforme Intelligente de Gestion des Réclamations
            </Typography>
          </Box>
        </Fade>

        <Grow in={loaded} timeout={1500}>
          <Box className="hero-section">
            <Typography variant="h3" className="hero-title">
              Simplifiez la gestion de vos réclamations
            </Typography>
            <Typography variant="body1" className="hero-description">
              Notre solution innovante vous permet de centraliser, suivre et
              résoudre efficacement toutes vos réclamations dans un
              environnement sécurisé et intuitif. Optimisez votre service client
              et améliorez votre satisfaction client.
            </Typography>
            <Button
              variant="contained"
              size="large"
              className="get-started-btn"
              onClick={navigateToLogin}
            >
              Accéder à la plateforme
            </Button>
            
            {/* Fixed scroll indicator */}
            <Box 
              className="scroll-indicator" 
              onClick={scrollToFeatures}
              aria-label="Découvrir les fonctionnalités"
            >
              <KeyboardArrowDownIcon />
            </Box>
          </Box>
        </Grow>

        <Box className="features-section" ref={featuresRef}>
          <Typography variant="h4" className="section-title">
            Fonctionnalités principales
          </Typography>

          <Grid container spacing={4} className="features-grid">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow 
                  in={loaded} 
                  timeout={1600 + index * 200}
                  style={{ transformOrigin: '0 0 0' }}
                >
                  <Card className="feature-card">
                    <CardContent sx={{ padding: isMobile ? '20px' : '24px' }}>
                      <Box className="feature-icon-container">
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" className="feature-title">
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="feature-description"
                      >
                        {feature.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
          
          {/* Navigation buttons at the bottom of features section */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 5, 
              px: 2 
            }}
          >
            <Button
              variant="outlined"
              startIcon={<KeyboardArrowUpIcon />}
              onClick={scrollToTop}
              className="nav-button"
              sx={{
                borderColor: 'var(--primary-color)',
                color: 'var(--primary-color)',
                '&:hover': {
                  backgroundColor: 'rgba(26, 134, 107, 0.08)',
                  borderColor: 'var(--primary-dark)'
                }
              }}
            >
              Haut de page
            </Button>
            
            <Button
              variant="outlined"
              endIcon={<KeyboardArrowDownIcon />}
              onClick={scrollToCta}
              className="nav-button"
              sx={{
                borderColor: 'var(--primary-color)',
                color: 'var(--primary-color)',
                '&:hover': {
                  backgroundColor: 'rgba(26, 134, 107, 0.08)',
                  borderColor: 'var(--primary-dark)'
                }
              }}
            >
              Suite
            </Button>
          </Box>
        </Box>

        <Fade in={loaded} timeout={2200}>
          <Box className="cta-section" ref={ctaRef}>
            <Typography variant="h4" className="cta-title">
              Prêt à améliorer votre gestion des réclamations ?
            </Typography>
            <Typography variant="body1" className="cta-description">
              Connectez-vous pour accéder à toutes les fonctionnalités de notre
              plateforme et optimiser le traitement de vos réclamations.
            </Typography>
            <Button
              variant="contained"
              size="large"
              className="login-button"
              onClick={navigateToLogin}
            >
              Se connecter
            </Button>
            
            {/* Button to go back to features */}
            <Box sx={{ mt: 4 }}>
              <Button
                variant="text"
                startIcon={<KeyboardArrowUpIcon />}
                onClick={scrollToFeatures}
                className="nav-button"
                sx={{
                  color: 'var(--primary-color)',
                  '&:hover': {
                    backgroundColor: 'rgba(26, 134, 107, 0.08)'
                  }
                }}
              >
                Retour aux fonctionnalités
              </Button>
            </Box>
          </Box>
        </Fade>

        <Box className="footer-section">
          <Typography variant="body2" className="copyright">
            © {new Date().getFullYear()} ReclamExpress. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
      
      <Fade in={showBackToTop}>
        <Box 
          className={`back-to-top ${showBackToTop ? 'visible' : ''}`} 
          onClick={scrollToTop}
          aria-label="Retour en haut"
        >
          <KeyboardArrowUpIcon />
        </Box>
      </Fade>
    </div>
  );
};

export default WelcomePage;