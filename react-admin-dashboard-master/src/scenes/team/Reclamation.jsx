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
  } from "@mui/material";
  import Header from "../../components/Header";
  import { tokens } from "../../theme";
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import axios from "axios";
  
  const Reclamation = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
  
    const [reclamation, setReclamation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchReclamation = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/reclamation/${id}`);
          setReclamation(response.data.reclamation);
        } catch (err) {
          setError(err.response?.data?.message || "Erreur lors de la récupération");
        } finally {
          setLoading(false);
        }
      };
  
      fetchReclamation();
    }, [id]);
  
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
  
    const champStyle = {
      border: `2px solid #40E0D0`, // vert turquoise
      borderRadius: "10px",
      padding: "16px",
      marginBottom: "16px",
      backgroundColor: "#ffffff",
      color: "#000000", // texte en noir
    };
  
    return (
      <Box sx={{ height: "100vh", overflow: "auto", padding: "20px" }}>
        <Header title="Détails de la Réclamation" subtitle="Informations détaillées sur la réclamation" />
  
        <Paper elevation={3} sx={{ padding: 3, borderRadius: "12px", backgroundColor: "#f4f4f4" }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={champStyle}>
                <Typography variant="h6" fontWeight="bold">Titre</Typography>
                <Typography>{reclamation.reclamation.titre}</Typography>
              </Box>
  
              <Box sx={champStyle}>
                <Typography variant="h6" fontWeight="bold">Description</Typography>
                <Typography>{reclamation.reclamation.description}</Typography>
              </Box>
  
              <Box sx={champStyle}>
                <Typography variant="h6" fontWeight="bold">Statut</Typography>
                <Typography>{reclamation.reclamation.statut}</Typography>
              </Box>
  
              <Box sx={champStyle}>
                <Typography variant="h6" fontWeight="bold">Localisation</Typography>
                <Typography>{reclamation.reclamation.localisation}</Typography>
              </Box>
  
              <Box sx={champStyle}>
                <Typography variant="h6" fontWeight="bold">Catégorie</Typography>
                <Typography>{reclamation.reclamation.Categorie.libelle}</Typography>
              </Box>
  
              <Box sx={champStyle}>
                <Typography variant="h6" fontWeight="bold">Région</Typography>
                <Typography>{reclamation.reclamation.region.nom}</Typography>
              </Box>
            </Grid>
  
            <Grid item xs={12} md={6}>
              <Card sx={{ width: "100%", borderRadius: "10px", boxShadow: 2 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={reclamation.image || "https://via.placeholder.com/400"}
                  alt="Image de la réclamation"
                  sx={{ objectFit: "cover", borderRadius: "10px" }}
                />
              </Card>
            </Grid>
          </Grid>
  
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
  