import { useState, useEffect } from "react";
import { Box, Typography, Button, Modal, Card, CardMedia, IconButton, Select, MenuItem } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MapIcon from "@mui/icons-material/Map";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "10px",
  overflow: "hidden",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "white",
  borderRadius: "12px",
  boxShadow: 24,
  p: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

// Status colors for markers
const statusColors = {
  en_attente: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  en_cours: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  resolu: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  rejete: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
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
  const [address, setAddress] = useState("");
  const [geocoder, setGeocoder] = useState(null);
  const navigate = useNavigate();

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
    setAddress(""); // Reset address when opening modal
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Parse location string "latitude, longitude" to {lat, lng} object
  const parseLocation = (locationStr) => {
    if (!locationStr) return null;

    try {
      const [lat, lng] = locationStr.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
      return null;
    } catch (error) {
      console.error("Error parsing location:", locationStr, error);
      return null;
    }
  };

  const onMapLoad = (map) => {
    // Initialize geocoder on map load
    setGeocoder(new window.google.maps.Geocoder());

    // If we have a selected reclamation, get its address
    if (selectedReclamation && geocoder) {
      getAddress(parseLocation(selectedReclamation.localisation));
    }
  };

  const getAddress = (position) => {
    if (!geocoder || !position) return;

    geocoder.geocode({ location: position }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        console.error("Geocoder failed due to: " + status);
        setAddress("Adresse non disponible");
      }
    });
  };

  useEffect(() => {
    // When selected reclamation changes and geocoder is available
    if (selectedReclamation && geocoder) {
      const position = parseLocation(selectedReclamation.localisation);
      if (position) {
        getAddress(position);
      }
    }
  }, [selectedReclamation, geocoder]);

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
    { field: "categorieLibelle", headerName: "Catégorie", flex: 1 },
    { field: "regionNom", headerName: "Région", flex: 1 },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => navigate(`/reclamation/${params.id}`)}
            >
              Détails
            </Button>
            <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<MapIcon />}
                onClick={() => handleOpenModal(params.row)}
            >
              Carte
            </Button>
          </Box>
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

                {/* Map Modal */}
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
                          <Typography variant="h5" gutterBottom sx={{ color: "#1565c0", mb: 2 }}>
                            {selectedReclamation.titre}
                          </Typography>

                          <Box sx={{ width: "100%", mb: 3 }}>
                            <LoadScript googleMapsApiKey="AIzaSyAJKMagO0Asw6OgccvD_PcdJxvOWLuE3Vc">
                              <GoogleMap
                                  mapContainerStyle={containerStyle}
                                  center={parseLocation(selectedReclamation.localisation)}
                                  zoom={15}
                                  onLoad={onMapLoad}
                              >
                                <Marker
                                    position={parseLocation(selectedReclamation.localisation)}
                                    title={selectedReclamation.titre}
                                    icon={statusColors[selectedReclamation.statut] || statusColors.en_attente}
                                />
                              </GoogleMap>
                            </LoadScript>
                          </Box>

                          <Card sx={{ width: "100%", p: 2, borderRadius: "10px", boxShadow: 3, mb: 2 }}>
                            <Typography variant="body1" paragraph>
                              {selectedReclamation.description}
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#388e3c" }}>
                                Status: <span style={{ color: "black" }}>{selectedReclamation.statut}</span>
                              </Typography>

                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#0288d1" }}>
                                Catégorie: <span style={{ color: "black" }}>{selectedReclamation.categorieLibelle}</span>
                              </Typography>

                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#7b1fa2" }}>
                                Région: <span style={{ color: "black" }}>{selectedReclamation.regionNom}</span>
                              </Typography>

                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                                Coordonnées: <span style={{ color: "black" }}>{selectedReclamation.localisation}</span>
                              </Typography>

                              {address && (
                                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#ed6c02" }}>
                                    Adresse: <span style={{ color: "black" }}>{address}</span>
                                  </Typography>
                              )}

                              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#9c27b0" }}>
                                Votes: <span style={{ color: "black" }}>{selectedReclamation.nombre_de_votes}</span>
                              </Typography>
                            </Box>
                          </Card>

                          <Button
                              variant="contained"
                              onClick={handleCloseModal}
                              sx={{ mt: 2, bgcolor: "#1976d2" }}
                          >
                            Fermer
                          </Button>
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