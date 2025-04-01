import { useState, useEffect } from "react";
import { Box, Typography, Button, Modal, Card, CardMedia, IconButton, Select, MenuItem } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "250px",
  borderRadius: "10px",
  overflow: "hidden",
};

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

const Reclamations = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reclamations, setReclamations] = useState([]);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [personnel, setPersonnel] = useState([]);

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur du localStorage au chargement du composant
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reclamationsResponse = await axios.get("http://localhost:3000/api/reclamations");
        setReclamations(reclamationsResponse.data.reclamations);
        
        const categoriesResponse = await axios.get("http://localhost:3000/api/categories");
        setCategories(categoriesResponse.data.categories);
        
        const regionsResponse = await axios.get("http://localhost:3000/api/regions");
        setRegions(regionsResponse.data.regions);

        // Fetch personnel data
        const adminsResponse = await axios.get('http://localhost:3000/api/admins');
        setPersonnel(adminsResponse.data.admins);
      } catch (err) {
        console.error("Erreur API:", err);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (reclamation) => {
    setSelectedReclamation(reclamation);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const filteredReclamations = reclamations.filter((rec) => 
    (selectedCategory ? rec.categorieId === selectedCategory : true) &&
    (selectedRegion ? rec.regionId === selectedRegion : true)
  );
  const isSuperAdmin = userRole === 'true';

  const reclamationColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "titre", headerName: "Titre", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
    { field: "statut", headerName: "Statut", flex: 1 },
    { field: "localisation", headerName: "Localisation", flex: 1 },
    { field: "categorieLibelle", headerName: "Catégorie", flex: 1 },
    { field: "regionNom", headerName: "Région", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          startIcon={<VisibilityIcon />}
          onClick={() => handleOpenModal(params.row)}
        >
          Voir
        </Button>
      ),
    },
  ];

  const personnelColumns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "nom",
      headerName: "Nom",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "prenom",
      headerName: "Prénom",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "superAdmin",
      headerName: "Super Admin",
      type: "boolean",
      flex: 0.75,
      renderCell: ({ row: { superAdmin } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              superAdmin === true
                ? colors.greenAccent[600]
                : colors.redAccent[700]
            }
            borderRadius="4px"
          >
            {superAdmin ? "Oui" : "Non"}
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: "100vh", overflow: "auto" }}>
      <Box m="20px">
        {isSuperAdmin ? (
          <>
            <Header title="RÉCLAMATIONS" subtitle="Gestion des réclamations du système" />
            <Box display="flex" gap={2} mb={2}>
              <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} displayEmpty>
                <MenuItem value="">Toutes les catégories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.libelle}</MenuItem>
                ))}
              </Select>
              <Select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} displayEmpty>
                <MenuItem value="">Toutes les régions</MenuItem>
                {regions.map((reg) => (
                  <MenuItem key={reg.id} value={reg.id}>{reg.nom}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box
              m="40px 0 0 0"
              height="75vh"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
                "& .name-column--cell": {
                  color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: colors.blueAccent[700],
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: colors.blueAccent[700],
                },
                "& .MuiCheckbox-root": {
                  color: `${colors.greenAccent[200]} !important`,
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                  color: `${colors.grey[100]} !important`,
                },
              }}
            >
              <DataGrid 
                rows={filteredReclamations.map(rec => ({
                  ...rec,
                  categorieLibelle: categories.find(cat => cat.id === rec.categorieId)?.libelle || "",
                  regionNom: regions.find(reg => reg.id === rec.regionId)?.nom || ""
                }))}
                columns={reclamationColumns} 
                components={{ Toolbar: GridToolbar }}
              />
            </Box>

            {/* Modal */}
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box sx={modalStyle}>
                <IconButton
                  onClick={handleCloseModal}
                  sx={{ position: "absolute", top: 10, right: 10 }}
                >
                  <CloseIcon />
                </IconButton>
                {selectedReclamation && (
                  <>
                    <Typography variant="h5" gutterBottom sx={{ color: "#1565c0" }}>{selectedReclamation.titre}</Typography>
                    <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>{selectedReclamation.description}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#388e3c" }}>Statut: {selectedReclamation.statut}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#d32f2f" }}>Localisation: {selectedReclamation.localisation}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#0288d1" }}>Catégorie: {selectedReclamation.categorieLibelle}</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#7b1fa2" }}>Région: {selectedReclamation.regionNom}</Typography>
                    <Card sx={{ width: "100%", mt: 2, borderRadius: "10px", boxShadow: 3 }}>
                      <CardMedia
                        component="img"
                        height="150"
                        image={selectedReclamation.image || "https://via.placeholder.com/400"}
                        alt="Image de la réclamation"
                      />
                    </Card>
                    <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2, bgcolor: "#1976d2" }}>Fermer</Button>
                  </>
                )}
              </Box>
            </Modal>
          </>
        ) : (
          <>
            <Header title="PERSONNELS" subtitle="Liste des personnels du système" />
            <Box
              m="40px 0 0 0"
              height="75vh"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                },
                "& .name-column--cell": {
                  color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: colors.blueAccent[700],
                  borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.primary[400],
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: colors.blueAccent[700],
                },
                "& .MuiCheckbox-root": {
                  color: `${colors.greenAccent[200]} !important`,
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                  color: `${colors.grey[100]} !important`,
                },
              }}
            >
              <DataGrid
                rows={personnel}
                columns={personnelColumns}
                components={{ Toolbar: GridToolbar }}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Reclamations;