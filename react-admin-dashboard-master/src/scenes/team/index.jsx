import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Modal, Card, CardMedia, IconButton, Select, MenuItem, Grid, CardContent, CardActions } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MapIcon from "@mui/icons-material/Map";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

// Déplacer la clé API dans une variable d'environnement ou un fichier de configuration
// Utilisation de process.env.REACT_APP_GOOGLE_MAPS_API_KEY si vous êtes sur Create React App
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "AIzaSyAJKMagO0Asw6OgccvD_PcdJxvOWLuE3Vc";

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
  const [userRegion, setUserRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [personnel, setPersonnel] = useState([]);
  const [address, setAddress] = useState("");
  const [geocoder, setGeocoder] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Nouvel état pour afficher la vue catégories ou la vue réclamations
  const [showCategoryView, setShowCategoryView] = useState(true);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentCategoryName, setCurrentCategoryName] = useState("");
  // Stats pour les catégories
  const [categoryStats, setCategoryStats] = useState({});

  // Récupérer les données utilisateur du localStorage une seule fois au montage
  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("userData");
      const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
      setUserData(parsedUserData);
      
      const role = localStorage.getItem("userRole");
      const regionId = localStorage.getItem("userRegionId");
      
      setUserRole(role || "");
      setUserRegion(regionId || "");
    } catch (err) {
      console.error("Erreur lors de la récupération des données utilisateur:", err);
      setError("Erreur lors de la récupération des données utilisateur");
    }
  }, []);

  // Fonction pour obtenir une couleur en fonction du statut
  const getStatusColor = useCallback((status) => {
    switch(status) {
      case 'en_attente': return colors.blueAccent[500];
      case 'en_cours': return colors.yellowAccent ? colors.yellowAccent[500] : "#FFC107"; 
      case 'resolu': return colors.greenAccent[500];
      case 'rejete': return colors.redAccent[500];
      default: return colors.grey[500];
    }
  }, [colors]);

  // Fonction pour analyser la localisation
  const parseLocation = useCallback((locationStr) => {
    if (!locationStr || typeof locationStr !== 'string') return null;

    try {
      const coords = locationStr.split(',');
      if (coords.length !== 2) return null;
      
      const lat = parseFloat(coords[0].trim());
      const lng = parseFloat(coords[1].trim());
      
      if (isNaN(lat) || isNaN(lng)) return null;
      
      return { lat, lng };
    } catch (error) {
      console.error("Error parsing location:", locationStr, error);
      return null;
    }
  }, []);

  // Récupérer les données API lorsque userData est disponible
  useEffect(() => {
    const fetchData = async () => {
      if (!userData) return; // Éviter les appels API si userData n'est pas encore chargé
      
      setLoading(true);
      setError(null);
      
      try {
        const regionId = userData?.regionId || localStorage.getItem("userRegionId");
        const role = localStorage.getItem("userRole");
        
        // Construction de l'URL avec vérification
        let reclamationsUrl = "http://localhost:3000/api/reclmationbyregion/";
        if (regionId) {
          reclamationsUrl += regionId;
        } else {
          // URL de secours si pas de région trouvée
          reclamationsUrl = "http://localhost:3000/api/reclamations";
        }

        // Exécuter les requêtes en parallèle pour une meilleure performance
        const [reclamationsResponse, categoriesResponse, regionsResponse, adminsResponse] = await Promise.all([
          axios.get(reclamationsUrl),
          axios.get("http://localhost:3000/api/categories"),
          axios.get("http://localhost:3000/api/regions"),
          axios.get('http://localhost:3000/api/admins')
        ]);

        const reclamationsData = reclamationsResponse.data.reclamations || [];
        const categoriesData = categoriesResponse.data.categories || [];
        const regionsData = regionsResponse.data.regions || [];
        
        setReclamations(reclamationsData);
        setCategories(categoriesData);
        setRegions(regionsData);
        setPersonnel(adminsResponse.data.admins || []);
        
        // Calculer les statistiques par catégorie
        const stats = {};
        
        categoriesData.forEach(category => {
          // Filtrer les réclamations par catégorie et par région si nécessaire
          const categoryReclamations = role !== 'true' && regionId
            ? reclamationsData.filter(rec => rec.categorieId === category.id && rec.regionId === regionId)
            : reclamationsData.filter(rec => rec.categorieId === category.id);
            
          // Compter les réclamations par statut
          const enAttente = categoryReclamations.filter(rec => rec.statut === 'en_attente').length;
          const enCours = categoryReclamations.filter(rec => rec.statut === 'en_cours').length;
          const resolu = categoryReclamations.filter(rec => rec.statut === 'résolue').length;
          const rejete = categoryReclamations.filter(rec => rec.statut === 'rejetée').length;
          
          stats[category.id] = {
            total: categoryReclamations.length,
            enAttente,
            enCours,
            resolu,
            rejete
          };
        });
        
        setCategoryStats(stats);
      } catch (err) {
        console.error("Erreur API:", err);
        setError("Erreur lors de la récupération des données");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userData]); // Dépendance à userData pour recharger si l'utilisateur change

  const handleOpenModal = (reclamation) => {
    setSelectedReclamation(reclamation);
    setAddress(""); // Reset address when opening modal
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  const handleCategoryClick = (categoryId, categoryName) => {
    setCurrentCategoryId(categoryId);
    setCurrentCategoryName(categoryName);
    setShowCategoryView(false);
  };
  
  const handleBackToCategories = () => {
    setShowCategoryView(true);
    setCurrentCategoryId(null);
    setCurrentCategoryName("");
  };

  // Utilisation de l'API moderne de Google Maps (Promises)
  const getAddress = useCallback(async (position) => {
    if (!geocoder || !position) return;

    try {
      const response = await geocoder.geocode({ location: position });
      if (response.results && response.results[0]) {
        setAddress(response.results[0].formatted_address);
      } else {
        setAddress("Adresse non disponible");
      }
    } catch (error) {
      console.error("Geocoder error:", error);
      setAddress("Erreur lors de la récupération de l'adresse");
    }
  }, [geocoder]);

  const onMapLoad = useCallback((map) => {
    // Initialize geocoder on map load if Google Maps is available
    if (window.google && window.google.maps) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  }, []);

  // Mettre à jour l'adresse quand la réclamation ou le géocodeur change
  useEffect(() => {
    if (selectedReclamation && geocoder) {
      const position = parseLocation(selectedReclamation.localisation);
      if (position) {
        getAddress(position);
      }
    }
  }, [selectedReclamation, geocoder, parseLocation, getAddress]);

  // Vérifier si l'utilisateur est un superAdmin (conversion appropriée de la chaîne)
  const isSuperAdmin = userRole === 'true';

  // Filtrer les réclamations selon le rôle et les filtres sélectionnés
  const filteredReclamations = reclamations.filter((rec) => {
    // Pour superAdmin, filtre par catégorie et région sélectionnées
    if (isSuperAdmin) {
      return (selectedCategory ? rec.categorieId === selectedCategory : true) &&
             (selectedRegion ? rec.regionId === selectedRegion : true);
    } 
    // Pour personnel normal, montrer les réclamations de la catégorie sélectionnée
    else if (currentCategoryId) {
      return rec.categorieId === currentCategoryId;
    }
    // Si aucune catégorie n'est sélectionnée, ne rien afficher
    return false;
  });

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

  // Affichage de l'état de chargement
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Chargement des données...</Typography>
      </Box>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Rendu du composant
  return (
      <Box sx={{ height: "100vh", overflow: "auto" }}>
        <Box m="20px">
          {isSuperAdmin ? (
              // Vue pour Super Admin
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
              </>
          ) : (
              // Vue pour Personnel - avec cartes de catégories
              <>
                {showCategoryView ? (
                  // Vue des catégories sous forme de cartes
                  <>
                    <Header title="CATÉGORIES DE RÉCLAMATIONS" subtitle="Sélectionnez une catégorie pour voir les réclamations" />
                    {categories.length === 0 ? (
                      <Typography variant="body1" sx={{ mt: 4, textAlign: "center" }}>
                        Aucune catégorie disponible
                      </Typography>
                    ) : (
                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        {categories.map((category) => (
                          <Grid item xs={12} sm={6} md={4} key={category.id}>
                            <Card 
                              sx={{
                                backgroundColor: colors.primary[400],
                                borderRadius: "10px",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                transition: "transform 0.3s ease",
                                cursor: "pointer",
                                "&:hover": {
                                  transform: "translateY(-5px)",
                                  
                                },
                              }}
                              onClick={() => handleCategoryClick(category.id, category.libelle)}
                            >
                              <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                  <CategoryIcon sx={{ fontSize: 36, color: colors.greenAccent[500], mr: 2 }} />
                                  <Typography variant="h5" sx={{ color: colors.greenAccent[400], fontWeight: "bold" }}>
                                    {category.libelle}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: colors.grey[100], mb: 2 }}>
                                  {category.description}
                                </Typography>
                                
                                {/* Statistiques de la catégorie */}
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="subtitle2" sx={{ color: colors.grey[300] }}>
                                    Total: {categoryStats[category.id]?.total || 0} réclamations
                                  </Typography>
                                  <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                      <Box
                                        width={12}
                                        height={12}
                                        borderRadius="50%"
                                        bgcolor={getStatusColor('en_attente')}
                                        mb={0.5}
                                      />
                                      <Typography variant="caption" sx={{ color: colors.grey[200] }}>
                                        {categoryStats[category.id]?.enAttente || 0}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                                        En attente
                                      </Typography>
                                    </Box>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                      <Box
                                        width={12}
                                        height={12}
                                        borderRadius="50%"
                                        bgcolor={getStatusColor('en_cours')}
                                        mb={0.5}
                                      />
                                      <Typography variant="caption" sx={{ color: colors.grey[200] }}>
                                        {categoryStats[category.id]?.enCours || 0}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                                        En cours
                                      </Typography>
                                    </Box>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                      <Box
                                        width={12}
                                        height={12}
                                        borderRadius="50%"
                                        bgcolor={getStatusColor('resolu')}
                                        mb={0.5}
                                      />
                                      <Typography variant="caption" sx={{ color: colors.grey[200] }}>
                                        {categoryStats[category.id]?.resolu || 0}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                                        Résolu
                                      </Typography>
                                    </Box>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                      <Box
                                        width={12}
                                        height={12}
                                        borderRadius="50%"
                                        bgcolor={getStatusColor('rejete')}
                                        mb={0.5}
                                      />
                                      <Typography variant="caption" sx={{ color: colors.grey[200] }}>
                                        {categoryStats[category.id]?.rejete || 0}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                                        Rejeté
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </CardContent>
                              <CardActions sx={{ justifyContent: "center" }}>
                                <Button 
                                  variant="contained"
                                  startIcon={<VisibilityIcon />}
                                  sx={{ 
                                    backgroundColor: colors.blueAccent[700],
                                    "&:hover": { backgroundColor: colors.blueAccent[800] }
                                  }}
                                >
                                  Voir les réclamations
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </>
                ) : (
                  // Vue des réclamations pour une catégorie spécifique
                  <>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBackToCategories}
                        sx={{ 
                          mr: 2,
                          color: colors.grey[100],
                          borderColor: colors.grey[700],
                          "&:hover": {
                            borderColor: colors.grey[500],
                            backgroundColor: colors.grey[900]
                          }
                        }}
                      >
                        Retour
                      </Button>
                      <Header 
                        title={`RÉCLAMATIONS: ${currentCategoryName}`} 
                        subtitle={`Liste des réclamations de la catégorie "${currentCategoryName}"`} 
                      />
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
                      {filteredReclamations.length === 0 ? (
                        <Typography variant="body1" sx={{ mt: 4, textAlign: "center" }}>
                          Aucune réclamation disponible pour cette catégorie
                        </Typography>
                      ) : (
                        <DataGrid
                          rows={filteredReclamations.map(rec => ({
                            ...rec,
                            categorieLibelle: categories.find(cat => cat.id === rec.categorieId)?.libelle || "",
                            regionNom: regions.find(reg => reg.id === rec.regionId)?.nom || ""
                          }))}
                          columns={reclamationColumns}
                          components={{ Toolbar: GridToolbar }}
                        />
                      )}
                    </Box>
                  </>
                )}
              </>
          )}
        </Box>

        {/* Map Modal - Optimisé pour ne charger l'API Google Maps qu'une seule fois */}
        {openModal && (
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
                      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={parseLocation(selectedReclamation.localisation) || { lat: 0, lng: 0 }}
                            zoom={15}
                            onLoad={onMapLoad}
                        >
                          {parseLocation(selectedReclamation.localisation) && (
                            <Marker
                                position={parseLocation(selectedReclamation.localisation)}
                                title={selectedReclamation.titre}
                                icon={statusColors[selectedReclamation.statut] || statusColors.en_attente}
                            />
                          )}
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
                          Catégorie: <span style={{ color: "black" }}>
                            {categories.find(cat => cat.id === selectedReclamation.categorieId)?.libelle || ""}
                          </span>
                        </Typography>

                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#7b1fa2" }}>
                          Région: <span style={{ color: "black" }}>
                            {regions.find(reg => reg.id === selectedReclamation.regionId)?.nom || ""}
                          </span>
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
        )}
      </Box>
  );
};

export default Reclamations;