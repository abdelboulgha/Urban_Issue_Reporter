import { Box, useTheme, CircularProgress, Typography, FormControl, FormGroup, FormControlLabel, Checkbox, Button, IconButton } from "@mui/material";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import SatelliteIcon from '@mui/icons-material/Satellite';
import MapIcon from '@mui/icons-material/Map';

// Constants moved outside component to prevent recreation
const GOOGLE_MAPS_API_KEY = "AIzaSyAJKMagO0Asw6OgccvD_PcdJxvOWLuE3Vc";
const API_BASE_URL = "http://localhost:3000/api";

// Define libraries as a constant outside the component to avoid recreating the array on each render
const GOOGLE_MAPS_LIBRARIES = ["places"];

const MAP_CONTAINER_STYLE = {
    width: '100%',
    height: '100%',
};

const DEFAULT_CENTER = {
    lat: 33.589886,
    lng: -7.603869,
};

const STATUS_MARKERS = {
    en_attente: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    en_cours: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    résolue: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    rejetée: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
};

const STATUS_LABELS = {
    en_attente: "En attente",
    en_cours: "En cours",
    résolue: "Résolu",
    rejetée: "Rejeté",
};

const STATUS_COLORS = {
    en_attente: '#2196f3',
    en_cours: '#ffc107',
    résolue: '#4caf50',
    rejetée: '#f44336'
};

// Parse location helper function (moved outside component)
const parseLocation = (locationStr) => {
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
};

const Map = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const location = useLocation();
    const navigate = useNavigate();
    const mapRef = useRef(null);

    // State management
    const [reclamations, setReclamations] = useState([]);
    const [center, setCenter] = useState(DEFAULT_CENTER);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReclamation, setSelectedReclamation] = useState(null);
    const [mapType, setMapType] = useState('roadmap');
    const [statusFilters, setStatusFilters] = useState({
        en_attente: true,
        en_cours: true,
        résolue: true,
        rejetée: true,
    });

    // Use react-google-maps useLoadScript hook with static libraries array
    const { isLoaded: isMapLibraryLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES, // Using the constant array defined outside
    });

    // Get user data once
    const userData = useMemo(() => JSON.parse(localStorage.getItem("userData") || "{}"), []);

    // Fetch reclamations data
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchReclamations = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/all-reclamations-by-region/${userData.id}`);

                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }

                const data = await response.json();

                if (isMounted && data.reclamations) {
                    // Process reclamations and add parsed locations
                    const processedReclamations = data.reclamations.map(rec => ({
                        ...rec,
                        parsedLocation: parseLocation(rec.localisation)
                    })).filter(rec => rec.parsedLocation !== null); // Only keep records with valid locations

                    setReclamations(processedReclamations);

                    // Find first valid location for center (prioritize active reclamations)
                    const firstValidRec = processedReclamations.find(rec =>
                        rec.parsedLocation && (rec.statut === 'en_attente' || rec.statut === 'en_cours')
                    ) || processedReclamations[0];

                    if (firstValidRec?.parsedLocation) {
                        setCenter(firstValidRec.parsedLocation);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch reclamations:", error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchReclamations();

        return () => {
            isMounted = false;
        };
    }, [userData.id]);

    // Reset selection when route changes
    useEffect(() => {
        setSelectedReclamation(null);
    }, [location.pathname]);

    // Force resize when tab becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && mapRef.current) {
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                    mapRef.current.panTo(center);
                }, 300);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [center]);

    // Handle map load
    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;

        // Ensure proper sizing and centering
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            if (mapRef.current) {
                mapRef.current.panTo(center);
            }
        }, 100);
    }, [center]);

    // Handle status filter change
    const handleStatusFilterChange = useCallback((status) => {
        setStatusFilters(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    }, []);

    // Handle "Select All" and "Unselect All" functionality
    const handleSelectAllStatuses = useCallback((selectAll) => {
        const newValues = {};
        Object.keys(statusFilters).forEach(status => {
            newValues[status] = selectAll;
        });
        setStatusFilters(newValues);
    }, [statusFilters]);

    // Toggle map type
    const toggleMapType = useCallback(() => {
        setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');
    }, []);

    // Navigate to reclamation details
    const handleViewDetails = useCallback((id) => {
        navigate(`/reclamation/${id}`);
        setSelectedReclamation(null);
    }, [navigate]);

    // Handle marker click - simplified to prevent double InfoWindows
    const handleMarkerClick = useCallback((reclamation) => {
        setSelectedReclamation(reclamation);
    }, []);

    // Memoize filtered reclamations to avoid unnecessary recalculation
    const filteredReclamations = useMemo(() =>
            reclamations
                .filter(reclamation => statusFilters[reclamation.statut]),
        [reclamations, statusFilters]
    );

    // Check if we have valid reclamations after filtering
    const hasNoReclamationsToShow = !isLoading && filteredReclamations.length === 0;

    // Memoize map options to prevent rerenders
    const mapOptions = useMemo(() => ({
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeId: mapType,
        fullscreenControl: true,
    }), [mapType]);

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
                        {Object.entries(statusFilters).map(([status, checked]) => (
                            <FormControlLabel
                                key={status}
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={() => handleStatusFilterChange(status)}
                                        sx={{
                                            '&.Mui-checked': {
                                                color: STATUS_COLORS[status]
                                            }
                                        }}
                                    />
                                }
                                label={STATUS_LABELS[status]}
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
                {/* Loading state */}
                {isLoading && (
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
                            Chargement des données...
                        </Typography>
                    </Box>
                )}

                {/* No reclamations message */}
                {hasNoReclamationsToShow && (
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

                {/* Map container */}
                <div style={{ width: '100%', height: '100%', visibility: isMapLibraryLoaded ? 'visible' : 'hidden' }}>
                    {isMapLibraryLoaded && (
                        <GoogleMap
                            mapContainerStyle={MAP_CONTAINER_STYLE}
                            center={center}
                            zoom={10}
                            onLoad={handleMapLoad}
                            onUnmount={() => mapRef.current = null}
                            options={mapOptions}
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

                            {/* Markers */}
                            {filteredReclamations.map((reclamation) => (
                                <Marker
                                    key={`marker-${reclamation.id}`}
                                    position={reclamation.parsedLocation}
                                    title={reclamation.titre}
                                    icon={STATUS_MARKERS[reclamation.statut]}
                                    onClick={() => handleMarkerClick(reclamation)}
                                />
                            ))}

                            {/* Info Window - Only render if selectedReclamation exists */}
                            {selectedReclamation && (
                                <InfoWindow
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
                                                    backgroundColor: STATUS_COLORS[selectedReclamation.statut]
                                                }}
                                            />
                                            <Typography
                                                variant="body2"
                                                sx={{ color: colors.grey[100] }}
                                            >
                                                {STATUS_LABELS[selectedReclamation.statut]}
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
                    )}
                </div>
            </Box>
        </Box>
    );
};

export default Map;