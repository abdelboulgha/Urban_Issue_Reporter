import { Box, Button, TextField, FormControlLabel, Checkbox, CircularProgress, Alert, IconButton, InputAdornment } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const FormPersonnel = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // URL de l'API - définie à un seul endroit pour consistance
  const API_URL = 'http://localhost:3000/api/admin';

  const handleFormSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      // Structure des données pour l'API
      const adminData = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        password: values.password,
        superAdmin: values.superAdmin
      };
      
      console.log("Envoi des données:", adminData);
      
      // Envoyer les données à l'API
      const response = await axios.post(API_URL, adminData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Réponse:", response.data);
      
      // Si la requête est réussie, réinitialiser le formulaire et rediriger vers la liste
      resetForm();
      navigate("/personnels");
    } catch (error) {
      console.error("Erreur détaillée:", error);
      
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'état hors de la plage 2xx
        console.error("Données de réponse:", error.response.data);
        console.error("Statut:", error.response.status);
        setSubmitError(`Erreur serveur: ${error.response.status} - ${error.response.data?.message || 'Erreur inconnue'}`);
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error("Requête sans réponse:", error.request);
        setSubmitError("Le serveur ne répond pas. Vérifiez que votre API est en cours d'exécution.");
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error("Erreur de configuration:", error.message);
        setSubmitError(`Erreur: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  // Fonction de test de l'API
  const testApiConnection = async () => {
    try {
      // Utiliser une requête GET pour tester la connexion
      const response = await axios.get(API_URL.replace(/\/admin$/, '/admins'));
      console.log("Test API réussi:", response.data);
      alert("Connexion à l'API réussie!");
    } catch (error) {
      console.error("Erreur de test API:", error);
      
      let errorMessage = `Erreur de connexion à l'API: ${error.message}`;
      
      // Ajouter des informations supplémentaires si disponibles
      if (error.response) {
        errorMessage += ` (Statut: ${error.response.status})`;
      }
      
      alert(errorMessage);
    }
  };

  // Gestion de l'affichage/masquage du mot de passe
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      sx={{
        height: "100vh", 
        overflow: "auto", 
      }}
    >
      <Box m="20px">
        <Header title="AJOUTER PERSONNEL" subtitle="Créer un nouveau profil personnel" />

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
        </Box>

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          validationSchema={personnelSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            isSubmitting: formikSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Nom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.nom}
                  name="nom"
                  error={!!touched.nom && !!errors.nom}
                  helperText={touched.nom && errors.nom}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Prénom"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.prenom}
                  name="prenom"
                  error={!!touched.prenom && !!errors.prenom}
                  helperText={touched.prenom && errors.prenom}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 4" }}
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  type={showPassword ? "text" : "password"}
                  label="Mot de passe"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.superAdmin}
                      onChange={(e) => {
                        setFieldValue("superAdmin", e.target.checked);
                      }}
                      name="superAdmin"
                    />
                  }
                  label="Super Admin"
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <Box display="flex" justifyContent="space-between" mt="20px">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/contacts")}
                >
                  Retour à la liste
                </Button>
                <Button 
                  type="submit" 
                  color="secondary" 
                  variant="contained"
                  disabled={isSubmitting || formikSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Ajouter Personnel"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

const personnelSchema = yup.object().shape({
  nom: yup.string().required("Ce champ est requis"),
  prenom: yup.string().required("Ce champ est requis"),
  email: yup.string().email("Email invalide").required("Ce champ est requis"),
  password: yup.string()
    .required("Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  superAdmin: yup.boolean(),
});

const initialValues = {
  nom: "",
  prenom: "",
  email: "",
  password: "",
  superAdmin: false,
};

export default FormPersonnel;