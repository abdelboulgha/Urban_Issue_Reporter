import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
  useTheme,
  CircularProgress,
  Grid,
  Paper,
  IconButton
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import FlagIcon from "@mui/icons-material/Flag";

const Reclamation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();

  const [reclamation, setReclamation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Exemple d'images multiples (à remplacer par vos données réelles)
  const [images, setImages] = useState([]);
  const [imagesReclamation, setImagesReclamation] = useState([]);

  useEffect(() => {
    const fetchReclamation = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/reclamation/${id}`);
        setReclamation(response.data.reclamation);
        
        // Récupération des photos liées à la réclamation
      const photosResponse = await axios.get(`http://localhost:3000/api/photos/reclamation/${id}`);
      setImagesReclamation(photosResponse.data);
      
      // Utiliser les images récupérées de l'API pour le carrousel
      if (photosResponse.data && photosResponse.data.length > 0) {
        const imageUrls = photosResponse.data.map(photo => photo.url);
        setImages(imageUrls);
      } else {
        // Image par défaut si aucune image n'est disponible
        setImages(["https://via.placeholder.com/800x400?text=Pas+d'image+disponible"]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la récupération");
    } finally {
      setLoading(false);
    }
  };

    fetchReclamation();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto-scroll des images toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ color: 'red', textAlign: 'center', mt: 2 }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
    
  // Définition des styles pour les champs avec icônes
  const fieldStyle = {
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "16px",
    backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    height: "100%",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    },
  };

  return (
    <Box sx={{ height: "100vh", overflow: "auto", padding: "20px" }}>
      <Header title="Détails de la Réclamation" subtitle="Informations détaillées sur la réclamation" />

      <Paper 
        elevation={3} 
        sx={{ 
          padding: 3, 
          borderRadius: "12px", 
          backgroundColor: theme.palette.mode === "dark" ? colors.primary[500] : "#f5f5f7",
          mb: 4
        }}
      >
        {/* Première section: 3 champs à gauche, 3 champs à droite */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Colonne de gauche */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={fieldStyle}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TitleIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                    <Typography variant="h6" fontWeight="bold">Titre</Typography>
                  </Box>
                  <Typography variant="body1">
                    {reclamation.reclamation.titre}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={fieldStyle}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <DescriptionIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                    <Typography variant="h6" fontWeight="bold">Description</Typography>
                  </Box>
                  <Typography variant="body1">
                    {reclamation.reclamation.description}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={fieldStyle}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <InfoIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                    <Typography variant="h6" fontWeight="bold">Statut</Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      bgcolor: reclamation.reclamation.statut === "En cours" ? colors.blueAccent[500] :
                              reclamation.reclamation.statut === "Résolu" ? colors.greenAccent[500] : 
                              colors.redAccent[500],
                      color: "#ffffff"
                    }}
                  >
                    <Typography>{reclamation.reclamation.statut}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          
          {/* Colonne de droite */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={fieldStyle}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                    <Typography variant="h6" fontWeight="bold">Localisation</Typography>
                  </Box>
                  <Typography variant="body1">
                    {reclamation.reclamation.localisation}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={fieldStyle}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CategoryIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                    <Typography variant="h6" fontWeight="bold">Catégorie</Typography>
                  </Box>
                  <Typography variant="body1">
                    {reclamation.reclamation.Categorie.libelle}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={fieldStyle}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <FlagIcon sx={{ mr: 1, color: colors.greenAccent[500] }} />
                    <Typography variant="h6" fontWeight="bold">Région</Typography>
                  </Box>
                  <Typography variant="body1">
                    {reclamation.reclamation.region.nom}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Deuxième section: Carrousel de photos */}
        <Box sx={{ position: 'relative', mt: 4, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="https://img.icons8.com/color/48/000000/picture.png" 
              alt="Photos" 
              style={{ width: 28, height: 28, marginRight: 8 }}
            />
            Photos ({images.length})
          </Typography>
          
          <Box sx={{ position: 'relative', width: '100%', height: 400, borderRadius: 2, overflow: 'hidden' }}>
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: index === currentImageIndex ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out',
                  '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 2,
                  }
                }}
              >
                <img src={image
} alt={`Photo ${index + 1}`} />
              </Box>
            ))}
            
            {/* Indicateurs de pagination */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 16, 
              left: '50%', 
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1
            }}>
              {images.map((_, index) => (
                <Box 
                  key={index}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: index === currentImageIndex ? colors.blueAccent[500] : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </Box>
            
            {/* Boutons de navigation */}
            <IconButton
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
              }}
              onClick={prevImage}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            
            <IconButton
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
              }}
              onClick={nextImage}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Bouton de retour */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            onClick={() => window.history.back()}
            sx={{
              backgroundColor: colors.blueAccent[600],
              "&:hover": {
                backgroundColor: colors.blueAccent[700],
              },
              fontWeight: "bold",
              borderRadius: "8px",
              paddingX: 4,
              paddingY: 1.5,
            }}
          >
            Retour
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Reclamation;