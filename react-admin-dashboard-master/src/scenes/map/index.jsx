import { Box, useTheme, CircularProgress, Typography, FormControl, FormGroup, FormControlLabel,
    Checkbox, Button, IconButton, Paper, Chip, Divider, Tooltip, Grid, Card, CardContent } from "@mui/material";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import SatelliteIcon from '@mui/icons-material/Satellite';
import MapIcon from '@mui/icons-material/Map';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import PendingIcon from '@mui/icons-material/Pending';

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

const STATUS_DATA = {
    en_attente: {
        label: "En attente",
        color: '#2196f3',
        icon: <PendingIcon fontSize="small" />,
    },
    en_cours: {
        label: "En cours",
        color: '#ffc107',
        icon: <TimelapseIcon fontSize="small" />,
    },
    résolue: {
        label: "Résolu",
        color: '#4caf50',
        icon: <CheckIcon fontSize="small" />,
    },
    rejetée: {
        label: "Rejeté",
        color: '#f44336',
        icon: <CloseIcon fontSize="small" />,
    }
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
    const [filtersExpanded, setFiltersExpanded] = useState(false);

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

    // Toggle filter panel
    const toggleFilters = useCallback(() => {
        setFiltersExpanded(prev => !prev);
    }, []);

    // Count reclamations by status
    const statusCounts = useMemo(() => {
        return reclamations.reduce((acc, rec) => {
            acc[rec.statut] = (acc[rec.statut] || 0) + 1;
            return acc;
        }, {});
    }, [reclamations]);

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
        styles: theme.palette.mode === 'dark' ? [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
            },
            {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
            },
            {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
            },
        ] : []
    }), [mapType, theme.palette.mode]);

    return (
        <Box m="20px">
            <Header
                title="CARTE DES RÉCLAMATIONS"
                subtitle="Visualisation géographique des réclamations"
            />

            {/* Statistics Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {Object.entries(STATUS_DATA).map(([status, data]) => (
                    <Grid item xs={6} sm={3} key={status}>
                        <Card
                            raised={statusFilters[status]}
                            sx={{
                                borderLeft: `6px solid ${data.color}`,
                                opacity: statusFilters[status] ? 1 : 0.7,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[8]
                                }
                            }}
                            onClick={() => handleStatusFilterChange(status)}
                        >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                            {statusCounts[status] || 0}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {data.label}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 1,
                                            borderRadius: '50%',
                                            backgroundColor: `${data.color}20`
                                        }}
                                    >
                                        <Box sx={{ color: data.color }}>
                                            {data.icon}
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Main Content Box */}
            <Paper
                elevation={3}
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    height: '65vh',
                }}
            >
                {/* Filters Panel */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 2,
                        width: filtersExpanded ? 280 : 'auto',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                    }}
                >
                    <Paper
                        elevation={4}
                        sx={{
                            p: 2,
                            backgroundColor: theme.palette.background.paper,
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={filtersExpanded ? 2 : 0}>
                            <Box display="flex" alignItems="center">
                                <FilterAltIcon sx={{ mr: 1 }} />
                                {filtersExpanded && (
                                    <Typography variant="h6" fontWeight="bold">
                                        Filtres
                                    </Typography>
                                )}
                            </Box>
                            <IconButton size="small" onClick={toggleFilters}>
                                {filtersExpanded ? <CloseIcon fontSize="small" /> : <FilterAltIcon fontSize="small" />}
                            </IconButton>
                        </Box>

                        {filtersExpanded && (
                            <>
                                <Divider sx={{ my: 1.5 }} />

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                    Statut des réclamations:
                                </Typography>

                                <FormControl component="fieldset" sx={{ width: '100%' }}>
                                    <FormGroup>
                                        {Object.entries(STATUS_DATA).map(([status, data]) => (
                                            <FormControlLabel
                                                key={status}
                                                control={
                                                    <Checkbox
                                                        checked={statusFilters[status]}
                                                        onChange={() => handleStatusFilterChange(status)}
                                                        sx={{
                                                            '&.Mui-checked': {
                                                                color: data.color
                                                            }
                                                        }}
                                                        size="small"
                                                    />
                                                }
                                                label={
                                                    <Box display="flex" alignItems="center">
                                                        {data.icon}
                                                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                                                            {data.label} ({statusCounts[status] || 0})
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>

                                <Box mt={2} display="flex" gap={1}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => handleSelectAllStatuses(true)}
                                    >
                                        Tout
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => handleSelectAllStatuses(false)}
                                    >
                                        Aucun
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Paper>
                </Box>

                {/* Map Type Toggle */}
                <Box sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 2,
                }}>
                    <Tooltip title={mapType === 'roadmap' ? 'Vue satellite' : 'Vue carte'}>
                        <Paper
                            elevation={4}
                            sx={{
                                borderRadius: '50%',
                                overflow: 'hidden',
                            }}
                        >
                            <IconButton
                                onClick={toggleMapType}
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover
                                    }
                                }}
                            >
                                {mapType === 'roadmap' ? <SatelliteIcon /> : <MapIcon />}
                            </IconButton>
                        </Paper>
                    </Tooltip>
                </Box>

                {/* Loading state */}
                {isLoading && (
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
                        backgroundColor: colors.primary[400],
                        zIndex: 1,
                    }}>
                        <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
                        <Typography variant="h6">
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
                        p: 3,
                    }}>
                        <InfoIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 'medium' }}>
                            Aucune réclamation à afficher
                        </Typography>
                        <Typography variant="body1" color="text.secondary" textAlign="center">
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
                            {/* Markers */}
                            {filteredReclamations.map((reclamation) => (
                                <Marker
                                    key={`marker-${reclamation.id}`}
                                    position={reclamation.parsedLocation}
                                    title={reclamation.titre}
                                    icon={STATUS_MARKERS[reclamation.statut]}
                                    onClick={() => handleMarkerClick(reclamation)}
                                    animation={window.google.maps.Animation.DROP}
                                />
                            ))}

                            {/* Info Window */}
                            {selectedReclamation && (
                                <InfoWindow
                                    position={selectedReclamation.parsedLocation}
                                    onCloseClick={() => setSelectedReclamation(null)}
                                    options={{
                                        pixelOffset: new window.google.maps.Size(0, -30)
                                    }}
                                >
                                    <Box sx={{
                                        p: 0,
                                        maxWidth: '320px',
                                        minWidth: '280px',
                                        backgroundColor: theme.palette.background.paper,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                    }}>
                                        {/* Status bar */}
                                        <Box
                                            sx={{
                                                height: '6px',
                                                width: '100%',
                                                backgroundColor: STATUS_DATA[selectedReclamation.statut].color
                                            }}
                                        />

                                        <Box sx={{ p: 2 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    mb: 1.5,
                                                }}
                                            >
                                                {selectedReclamation.titre}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <Chip
                                                    icon={STATUS_DATA[selectedReclamation.statut].icon}
                                                    label={STATUS_DATA[selectedReclamation.statut].label}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${STATUS_DATA[selectedReclamation.statut].color}20`,
                                                        color: STATUS_DATA[selectedReclamation.statut].color,
                                                        fontWeight: 500,
                                                    }}
                                                />

                                                <Box sx={{ flex: 1 }} />

                                                <Tooltip title="Localisation">
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            color: 'text.secondary',
                                                            fontSize: '0.75rem'
                                                        }}
                                                    >
                                                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                                                        <Typography variant="caption" noWrap>
                                                            {selectedReclamation.parsedLocation.lat.toFixed(6)}, {selectedReclamation.parsedLocation.lng.toFixed(6)}
                                                        </Typography>
                                                    </Box>
                                                </Tooltip>
                                            </Box>

                                            <Divider sx={{ my: 1.5 }} />

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 2,
                                                    color: theme.palette.text.secondary,
                                                    height: '4.5em',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                }}
                                            >
                                                {selectedReclamation.description || "Pas de description disponible."}
                                            </Typography>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                onClick={() => handleViewDetails(selectedReclamation.id)}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    boxShadow: 2,
                                                    mt: 1,
                                                }}
                                            >
                                                VOIR LES DÉTAILS
                                            </Button>
                                        </Box>
                                    </Box>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    )}
                </div>
            </Paper>
        </Box>
    );
};

export default Map;