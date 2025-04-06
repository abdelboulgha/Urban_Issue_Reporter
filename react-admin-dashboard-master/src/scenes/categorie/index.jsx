import { useState, useEffect } from "react";
import { Box, Typography, Button, Modal, Card, CardContent, CardActions, IconButton, Grid, TextField, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "white",
  borderRadius: "12px",
  boxShadow: 24,
  p: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const Categories = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [editedCategory, setEditedCategory] = useState({ libelle: "", description: "" });
  const [newCategory, setNewCategory] = useState({ libelle: "", description: "" });
  const [errors, setErrors] = useState({ libelle: false, description: false });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesResponse = await axios.get("http://localhost:3000/api/categories");
      setCategories(categoriesResponse.data.categories);
      setLoading(false);
    } catch (err) {
      console.error("Erreur API:", err);
      setFormError("Erreur lors du chargement des catégories: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setNewCategory({ libelle: "", description: "" });
    setErrors({ libelle: false, description: false });
    setFormError("");
    setEditMode(false);
    setOpenModal(true);
  };

  const handleOpenModal = (category) => {
    setSelectedCategory({...category});
    setOpenModal(true);
    setEditMode(false);
    setFormError("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditMode(false);
    setNewCategory({ libelle: "", description: "" });
    setEditedCategory({ libelle: "", description: "" });
    setErrors({ libelle: false, description: false });
    setFormError("");
  };

  const handleEdit = (category) => {
    setSelectedCategory({...category});
    // Assurez-vous que l'ID est préservé dans l'objet editedCategory
    setEditedCategory({
      id: category.id,
      libelle: category.libelle,
      description: category.description
    });
    setEditMode(true);
    setOpenModal(true);
    setErrors({ libelle: false, description: false });
    setFormError("");
  };

  const validateFields = (category) => {
    const newErrors = {
      libelle: !category.libelle.trim(),
      description: !category.description.trim()
    };
    
    setErrors(newErrors);
    
    return !newErrors.libelle && !newErrors.description;
  };

  const handleSaveEdit = async () => {
    if (!validateFields(editedCategory)) {
      setFormError("Tous les champs sont obligatoires");
      return;
    }
    
    if (!selectedCategory || !selectedCategory.id) {
      setFormError("ID de catégorie manquant");
      return;
    }
    
    try {
      setLoading(true);
      console.log(`Modification de la catégorie ID: ${selectedCategory.id}`);
      console.log("Données envoyées:", editedCategory);
      
      // S'assurer que l'ID est dans les données envoyées
      const dataToSend = {
        ...editedCategory,
        id: selectedCategory.id
      };
      
      const response = await axios.put(`http://localhost:3000/api/categorie/${selectedCategory.id}`, dataToSend);
      
      if (response.data) {
        console.log("Réponse de l'API:", response.data);
        await fetchCategories();
        setOpenModal(false);
        setEditedCategory({ libelle: "", description: "" });
        setErrors({ libelle: false, description: false });
        setFormError("");
      } else {
        setFormError("Réponse inattendue de l'API");
      }
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      if (err.response) {
        console.error("Détails de l'erreur:", err.response.data);
      }
      setFormError("Erreur lors de la modification: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    setSelectedCategory(categoryId);
    setOpenConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`http://localhost:3000/api/categorie/${selectedCategory}`);
      
      if (response.data) {
        await fetchCategories();
        setOpenConfirm(false);
      }
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setFormError("Erreur lors de la suppression: " + (err.response?.data?.message || err.message));
      setLoading(false);
      setOpenConfirm(false);
    }
  };

  const handleAddCategory = async () => {
    if (!validateFields(newCategory)) {
      setFormError("Tous les champs sont obligatoires");
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/api/categorie", newCategory);
      
      if (response.data) {
        console.log("Réponse de l'API (ajout):", response.data);
        await fetchCategories();
        setOpenModal(false);
        setNewCategory({ libelle: "", description: "" });
        setErrors({ libelle: false, description: false });
        setFormError("");
      } else {
        setFormError("Réponse inattendue de l'API");
      }
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la catégorie:", err);
      if (err.response) {
        console.error("Détails de l'erreur (ajout):", err.response.data);
      }
      setFormError("Erreur lors de l'ajout: " + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  // Ajout de la fonction pour valider et nettoyer les champs lors de la saisie
  const handleInputChange = (e, isNewCategory = false) => {
    const { name, value } = e.target;
    
    if (isNewCategory) {
      setNewCategory({ ...newCategory, [name]: value });
      // Réinitialiser l'erreur du champ si l'utilisateur commence à saisir
      if (value.trim() !== '') {
        setErrors({ ...errors, [name]: false });
      }
    } else {
      setEditedCategory({ ...editedCategory, [name]: value });
      // Réinitialiser l'erreur du champ si l'utilisateur commence à saisir
      if (value.trim() !== '') {
        setErrors({ ...errors, [name]: false });
      }
    }
  };

  return (
    <Box sx={{ height: "100vh", overflow: "auto" }}>
      <Box m="20px">
        <Header title="CATÉGORIES" subtitle="Gestion des catégories du système" />
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ 
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              my: 2
            }} 
            onClick={handleOpenAdd}
            disabled={loading}
          >
            Ajouter une Catégorie
          </Button>
        </Box>
        
        {formError && !openModal && !openConfirm && (
          <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>
        )}
        
        <Box
          m="40px 0 0 0"
          sx={{
            "& .MuiCard-root": {
              backgroundColor: colors.primary[400],
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            },
            "& .MuiCardContent-root": {
              padding: "20px",
            },
            "& .MuiCardActions-root": {
              padding: "0 16px 16px 16px",
              justifyContent: "flex-end",
            },
            "& .MuiIconButton-root": {
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: colors.grey[700],
              },
            },
          }}
        >
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: colors.greenAccent[400], fontWeight: "bold", mb: 1 }}>
                      {category.libelle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.grey[100] }}>
                      {category.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleOpenModal(category)} disabled={loading}
                      sx={{ backgroundColor: colors.blueAccent[700], mr: 1, "&:hover": { backgroundColor: colors.blueAccent[800] } }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(category)} disabled={loading}
                      sx={{ backgroundColor: colors.greenAccent[700], mr: 1, "&:hover": { backgroundColor: colors.greenAccent[800] } }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(category.id)} disabled={loading}
                      sx={{ backgroundColor: colors.redAccent[700], "&:hover": { backgroundColor: colors.redAccent[800] } }}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Modal */}
        <Modal open={openModal} onClose={loading ? null : handleCloseModal}>
          <Box sx={{
            ...modalStyle,
            bgcolor: colors.primary[400],
            color: colors.grey[100],
          }}>
            <IconButton
              onClick={handleCloseModal}
              sx={{ 
                position: "absolute", 
                top: 10, 
                right: 10,
                color: colors.grey[100],
                "&:hover": { backgroundColor: colors.grey[700] }
              }}
              disabled={loading}
            >
              <CloseIcon />
            </IconButton>
            {selectedCategory && !editMode && (
              <>
                <Typography variant="h5" gutterBottom sx={{ color: colors.greenAccent[400], fontWeight: "bold" }}>
                  {selectedCategory.libelle}
                </Typography>
                <Typography variant="body1" paragraph sx={{ textAlign: "center", color: colors.grey[100] }}>
                  {selectedCategory.description}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleCloseModal} 
                  sx={{ 
                    mt: 2, 
                    backgroundColor: colors.blueAccent[700],
                    "&:hover": { backgroundColor: colors.blueAccent[800] }
                  }}
                  disabled={loading}
                >
                  Fermer
                </Button>
              </>
            )}
            {editMode && (
              <>
                <Typography variant="h5" gutterBottom sx={{ color: colors.greenAccent[400], fontWeight: "bold" }}>
                  Modifier Catégorie
                </Typography>
                {formError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{formError}</Alert>}
                <TextField
                  name="libelle"
                  label="Libellé"
                  fullWidth
                  margin="normal"
                  value={editedCategory.libelle}
                  onChange={(e) => handleInputChange(e)}
                  error={errors.libelle}
                  helperText={errors.libelle ? "Le libellé est obligatoire" : ""}
                  required
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: colors.grey[400],
                      },
                      "&:hover fieldset": {
                        borderColor: colors.grey[300],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[400],
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.grey[300],
                    },
                    "& .MuiOutlinedInput-input": {
                      color: colors.grey[100],
                    },
                  }}
                />
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  margin="normal"
                  value={editedCategory.description}
                  onChange={(e) => handleInputChange(e)}
                  error={errors.description}
                  helperText={errors.description ? "La description est obligatoire" : ""}
                  required
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: colors.grey[400],
                      },
                      "&:hover fieldset": {
                        borderColor: colors.grey[300],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[400],
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.grey[300],
                    },
                    "& .MuiOutlinedInput-input": {
                      color: colors.grey[100],
                    },
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleSaveEdit} 
                  sx={{ 
                    mt: 2, 
                    backgroundColor: colors.greenAccent[700],
                    "&:hover": { backgroundColor: colors.greenAccent[800] }
                  }}
                  disabled={loading}
                >
                  {loading ? "Sauvegarde en cours..." : "Sauvegarder"}
                </Button>
              </>
            )}
            {!editMode && !selectedCategory && (
              <>
                <Typography variant="h5" gutterBottom sx={{ color: colors.greenAccent[400], fontWeight: "bold" }}>
                  Ajouter Catégorie
                </Typography>
                {formError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{formError}</Alert>}
                <TextField
                  name="libelle"
                  label="Libellé"
                  fullWidth
                  margin="normal"
                  value={newCategory.libelle}
                  onChange={(e) => handleInputChange(e, true)}
                  error={errors.libelle}
                  helperText={errors.libelle ? "Le libellé est obligatoire" : ""}
                  required
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: colors.grey[400],
                      },
                      "&:hover fieldset": {
                        borderColor: colors.grey[300],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[400],
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.grey[300],
                    },
                    "& .MuiOutlinedInput-input": {
                      color: colors.grey[100],
                    },
                  }}
                />
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  margin="normal"
                  value={newCategory.description}
                  onChange={(e) => handleInputChange(e, true)}
                  error={errors.description}
                  helperText={errors.description ? "La description est obligatoire" : ""}
                  required
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: colors.grey[400],
                      },
                      "&:hover fieldset": {
                        borderColor: colors.grey[300],
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[400],
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.grey[300],
                    },
                    "& .MuiOutlinedInput-input": {
                      color: colors.grey[100],
                    },
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddCategory} 
                  sx={{ 
                    mt: 2, 
                    backgroundColor: colors.greenAccent[700],
                    "&:hover": { backgroundColor: colors.greenAccent[800] }
                  }}
                  disabled={loading}
                >
                  {loading ? "Ajout en cours..." : "Ajouter"}
                </Button>
              </>
            )}
          </Box>
        </Modal>

        {/* Confirmation Modal */}
        <Modal open={openConfirm} onClose={loading ? null : () => setOpenConfirm(false)}>
          <Box sx={{
            ...modalStyle,
            bgcolor: colors.primary[400],
            color: colors.grey[100],
          }}>
            <Typography variant="h6" sx={{ color: colors.grey[100] }}>
              Êtes-vous sûr de vouloir supprimer cette catégorie ?
            </Typography>
            {formError && <Alert severity="error" sx={{ width: '100%', my: 2 }}>{formError}</Alert>}
            <Box mt={2} display="flex" justifyContent="center">
              <Button 
                variant="contained" 
                sx={{ 
                  mr: 2, 
                  backgroundColor: colors.redAccent[700],
                  "&:hover": { backgroundColor: colors.redAccent[800] }
                }}
                onClick={confirmDelete} 
                disabled={loading}
              >
                {loading ? "Suppression..." : "Confirmer"}
              </Button>
              <Button 
                variant="contained"
                sx={{ 
                  backgroundColor: colors.blueAccent[700],
                  "&:hover": { backgroundColor: colors.blueAccent[800] }
                }}
                onClick={() => setOpenConfirm(false)}
                disabled={loading}
              >
                Annuler
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Categories;