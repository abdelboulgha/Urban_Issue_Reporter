import { Box, useTheme, CircularProgress, Typography, FormControl, FormGroup, FormControlLabel, Checkbox, Button, IconButton } from "@mui/material";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import SatelliteIcon from '@mui/icons-material/Satellite';
import MapIcon from '@mui/icons-material/Map';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: 33.589886,
    lng: -7.603869,
};

const statusColors = {
    en_attente: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    en_cours: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    résolue: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    rejetée: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
};

const statusLabels = {
    en_attente: "En attente",
    en_cours: "En cours",
    résolue: "Résolu",
    rejetée: "Rejeté",
};

const Map = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();
    const navigate = useNavigate();
    const [reclamations, setReclamations] = useState([]);
    const [center, setCenter] = useState(defaultCenter);
    const [mapReady, setMapReady] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const mapRef = useRef(null);
    const loadScriptKey = useRef(Date.now());
    const [selectedReclamation, setSelectedReclamation] = useState(null);
    const [markersReady, setMarkersReady] = useState(false);
    const [mapType, setMapType] = useState('roadmap');
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    // Status filters - All status types are true by default
    const [statusFilters, setStatusFilters] = useState({
        en_attente: true,
        en_cours: true,
        résolue: true,
        rejetée: true,
    });

    // Parse location string
    const parseLocation = useCallback((locationStr) => {
        if (!locationStr) return null;
        try {
            const locString = String(locationStr).trim();
            const [lat, lng] = locString.split(',').map(coord => parseFloat(coord.trim()));

            if (isNaN(lat) || isNaN(lng)) {
                console.error("Invalid location format:", locationStr);
                return null;
            }

            return { lat, lng };
        } catch (error) {
            console.error("Error parsing location:", error, "for string:", locationStr);
            return null;
        }
    }, []);

    // Fetch data
    useEffect(() => {
        let isMounted = true;
        setDataLoaded(false);
        setMarkersReady(false);

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/all-reclamations-by-region/${userData.id}`);
                const data = await response.json();

                if (isMounted && data.reclamations) {
                    const processedReclamations = data.reclamations.map(rec => ({
                        ...rec,
                        parsedLocation: parseLocation(rec.localisation)
                    }));

                    setReclamations(processedReclamations);

                    // Find first valid location for center (prioritize active reclamations)
                    const firstValidRec = processedReclamations.find(rec =>
                        rec.parsedLocation && (rec.statut === 'en_attente' || rec.statut === 'en_cours')
                    ) || processedReclamations.find(rec => rec.parsedLocation);

                    if (firstValidRec) {
                        setCenter(firstValidRec.parsedLocation);
                    }
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                if (isMounted) {
                    setDataLoaded(true);
                }
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, [parseLocation, userData.id]);

    // Reset map when route changes
    useEffect(() => {
        loadScriptKey.current = Date.now();
        setMapReady(false);
        setMarkersReady(false);
        setSelectedReclamation(null);
    }, [location.pathname]);

    // Trigger markers render after map is ready and data is loaded
    useEffect(() => {
        if (mapReady && dataLoaded && !markersReady) {
            const timer = setTimeout(() => {
                setMarkersReady(true);
                if (mapRef.current) {
                    window.dispatchEvent(new Event('resize'));
                }
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [mapReady, dataLoaded, markersReady]);

    // Handle map load
    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;
        setMapReady(true);

        setTimeout(() => {
            if (mapRef.current) {
                window.dispatchEvent(new Event('resize'));
                mapRef.current.setCenter(center);
            }
        }, 100);
    }, [center]);

    // Force resize when tab becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && mapRef.current) {
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                    mapRef.current.setCenter(center);
                }, 300);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [center]);

    // Handle status filter change
    const handleStatusFilterChange = (status) => {
        setStatusFilters(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    };

    // Handle "Select All" and "Unselect All" functionality
    const handleSelectAllStatuses = (selectAll) => {
        const newValues = {};
        Object.keys(statusFilters).forEach(status => {
            newValues[status] = selectAll;
        });
        setStatusFilters(newValues);
    };

    // Toggle map type
    const toggleMapType = () => {
        setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');
    };

    // Navigate to reclamation details
    const handleViewDetails = (id) => {
        // Direct navigation without modal confirmation
        navigate(`/reclamation/${id}`);
        // Close the InfoWindow after navigation
        setSelectedReclamation(null);
    };

    // Handle marker click
    const handleMarkerClick = (reclamation) => {
        setSelectedReclamation({...reclamation, parsedLocation: reclamation.parsedLocation});
    };

    // Filter reclamations based on selected status filters
    const filteredReclamations = reclamations.filter(
        reclamation => statusFilters[reclamation.statut]
    );

    // Verify we have valid reclamations to display
    const validReclamations = filteredReclamations.filter(
        rec => rec.parsedLocation
    );

    return (
        <Box m="20px">
            <Header
                title="CARTE DES RÉCLAMATIONS"
                subtitle="Visualisation géographique des réclamations"
            />

            {/* Status filter controls */}
            <Box
                m="20px 0"
                p="15px"
                sx={{
                    backgroundColor: colors.primary[400],
                    borderRadius: "8px",
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb="10px">
                    <Typography variant="h5">Filtrer par statut:</Typography>
                    <Box>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleSelectAllStatuses(true)}
                            sx={{ mr: 1 }}
                        >
                            Tout sélectionner
                        </Button>
                        <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleSelectAllStatuses(false)}
                        >
                            Tout désélectionner
                        </Button>
                    </Box>
                </Box>

                <FormControl component="fieldset">
                    <FormGroup row>
                        {Object.keys(statusFilters).map(status => (
                            <FormControlLabel
                                key={status}
                                control={
                                    <Checkbox
                                        checked={statusFilters[status]}
                                        onChange={() => handleStatusFilterChange(status)}
                                        sx={{
                                            '&.Mui-checked': {
                                                color: status === 'en_attente' ? '#2196f3' :
                                                    status === 'en_cours' ? '#ffc107' :
                                                        status === 'résolue' ? '#4caf50' : '#f44336'
                                            }
                                        }}
                                    />
                                }
                                label={statusLabels[status]}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </Box>

            <Box
                m="20px 0 0 0"
                height="65vh"
                sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: `1px solid ${colors.grey[200]}`,
                    position: 'relative',
                }}
            >
                {(!dataLoaded || !mapReady) && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.primary[400],
                        zIndex: 1,
                    }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            {!dataLoaded ? "Chargement des données..." : "Initialisation de la carte..."}
                        </Typography>
                    </Box>
                )}

                {validReclamations.length === 0 && dataLoaded && mapReady && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        zIndex: 1,
                    }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Aucune réclamation à afficher
                        </Typography>
                        <Typography variant="body2">
                            Veuillez vérifier vos filtres ou ajouter des réclamations avec coordonnées valides.
                        </Typography>
                    </Box>
                )}

                <div style={{ width: '100%', height: '100%', visibility: mapReady ? 'visible' : 'hidden' }}>
                    <LoadScript
                        googleMapsApiKey="AIzaSyAJKMagO0Asw6OgccvD_PcdJxvOWLuE3Vc"
                        key={loadScriptKey.current}
                    >
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={10}
                            onLoad={handleMapLoad}
                            onUnmount={() => mapRef.current = null}
                            options={{
                                disableDefaultUI: true,
                                zoomControl: true,
                                mapTypeId: mapType,
                            }}
                        >
                            {/* Map type toggle button */}
                            <Box sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                zIndex: 1,
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            }}>
                                <IconButton onClick={toggleMapType}>
                                    {mapType === 'roadmap' ? <SatelliteIcon /> : <MapIcon />}
                                </IconButton>
                            </Box>

                            {(markersReady || dataLoaded) && validReclamations.map((reclamation, index) => {
                                const position = reclamation.parsedLocation;
                                if (!position) return null;

                                return (
                                    <Marker
                                        key={`${reclamation.id}-${index}`}
                                        position={position}
                                        title={reclamation.titre}
                                        icon={statusColors[reclamation.statut] || statusColors.en_attente}
                                        onClick={() => handleMarkerClick(reclamation)}
                                    />
                                );
                            })}

                            {selectedReclamation && selectedReclamation.parsedLocation && (
                                <InfoWindow
                                    key={`info-${selectedReclamation.id}`}
                                    position={selectedReclamation.parsedLocation}
                                    onCloseClick={() => setSelectedReclamation(null)}
                                    options={{
                                        pixelOffset: new window.google.maps.Size(0, -30)
                                    }}
                                >
                                    <div style={{
                                        padding: '16px',
                                        maxWidth: '300px',
                                        backgroundColor: colors.primary[400],
                                        borderRadius: '8px',
                                        boxShadow: theme.shadows[3]
                                    }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                mb: 1,
                                                color: colors.grey[100],
                                            }}
                                        >
                                            {selectedReclamation.titre}
                                        </Typography>

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2
                                        }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    display: 'inline-block',
                                                    mr: 1,
                                                    backgroundColor: selectedReclamation.statut === 'en_attente' ? '#2196f3' :
                                                        selectedReclamation.statut === 'en_cours' ? '#ffc107' :
                                                            selectedReclamation.statut === 'résolue' ? '#4caf50' : '#f44336'
                                                }}
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{ color: colors.grey[100] }}
                                            >
                                                {statusLabels[selectedReclamation.statut]}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mb: 2,
                                                color: colors.grey[100],
                                            }}
                                        >
                                            {selectedReclamation.description && selectedReclamation.description.length > 100
                                                ? `${selectedReclamation.description.substring(0, 100)}...`
                                                : selectedReclamation.description}
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            onClick={() => handleViewDetails(selectedReclamation.id)}
                                            sx={{
                                                mt: 1,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            VOIR LES DÉTAILS
                                        </Button>
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </LoadScript>
                </div>
            </Box>
        </Box>
    );
};

export default Map;