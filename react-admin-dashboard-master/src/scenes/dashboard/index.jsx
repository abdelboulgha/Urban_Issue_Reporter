import { Box, Typography, useTheme, Stack, Avatar, alpha, Paper, Card, CardContent, IconButton, Divider, Chip, Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import GroupIcon from '@mui/icons-material/Group';
import ReportIcon from '@mui/icons-material/Report';
import PlaceIcon from '@mui/icons-material/Place';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import MapOfMorocco from "../../images/map-of-morocco.png";
import BarChart from "../../components/BarChart";
import {useCallback, useEffect, useState} from "react";
import DoughnutChart from "../../components/DoughnutChart";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const colors = tokens(theme.palette.mode);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalCitoyens, setTotalCitoyens] = useState(0);
    const [totalReclamations, setTotalReclamations] = useState(0);
    const [totalRegions, setTotalRegions] = useState(0);
    const [urgentsReclamation, setUrgentsReclamation] = useState([]);
    const userRole = localStorage.getItem("userRole");
    const isSuperAdmin = userRole === 'true';
    console.log(isSuperAdmin);

    const getAdminsCount = async () => {
        await axios.get(`http://localhost:3000/api/admins-count/`)
            .then(response => {
                setTotalAdmins(response.data.data.totalAdmins);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du nombre d'admins :", error);
            });
    }

    const getCitoyensCount = async () => {
        await axios.get("http://localhost:3000/api/citoyens-count")
            .then(response => {
                setTotalCitoyens(response.data.data.totalCitoyens);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du nombre d'citoyens :", error);
            });
    }

    const getReclamationsCount = async (id) => {
        await axios.get(`http://localhost:3000/api/reclamations-count/${id}`)
            .then(response => {
                setTotalReclamations(response.data.data.totalReclamations);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du nombre d'reclamations :", error);
            });
    }

    const getUrgentsReclamations = async (id) => {
        await axios.get(`http://localhost:3000/api/urgents-reclamations/${id}`)
            .then(response => {
                setUrgentsReclamation(response.data.data);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du nombre d'regions :", error);
            });
    }

    const getRegionsCount = async () => {
        await axios.get("http://localhost:3000/api/regions-count")
            .then(response => {
                setTotalRegions(response.data.data.totalRegions);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération du nombre d'regions :", error);
            });
    }

    const handleViewDetails = useCallback((id) => {
        navigate(`/reclamation/${id}`);
    }, [navigate]);

    useEffect(() => {
        getAdminsCount();
        getReclamationsCount(userData.id);
        getCitoyensCount();
        getRegionsCount();
        getUrgentsReclamations(userData.id);
    }, []);

    return (
        <Box
            sx={{
                height: "100vh",
                overflow: "auto",
                px: 2,
                py: 1,
            }}
        >
            <Box m="20px">
                {/* HEADER */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        backgroundColor: alpha(colors.primary[400], 0.8),
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Header
                            title="TABLEAU DE BORD"
                            subtitle={
                                <>
                                    Bienvenue{" "}
                                    <span style={{color: colors.greenAccent[400], fontWeight: "bold"}}>{userData?.prenom}</span> sur votre
                                    tableau de bord
                                </>
                            }
                        />
                    </Box>
                </Paper>

                {/* GRID & CHARTS */}
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    gap="24px"
                >
                    {/* ROW 1 - STAT CARDS */}
                    {isSuperAdmin && (
                    <Box
                        gridColumn="span 12"
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gap="20px"
                    >
                        <Card
                            elevation={4}
                            sx={{
                                gridColumn: "span 3",
                                backgroundColor: alpha(colors.primary[400], 0.9),
                                borderRadius: 3,
                                overflow: "hidden",
                                position: "relative",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: theme.shadows[10],
                                    "& .hover-reveal": {
                                        opacity: 1,
                                    }
                                }
                            }}
                        >
                            <Box sx={{ position: "absolute", top: 0, left: 0, width: "5px", height: "100%", backgroundColor: colors.greenAccent[500] }} />
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack spacing={1}>
                                        <Typography variant="h3" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                                            {totalAdmins}
                                        </Typography>
                                        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                                            Admins
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(colors.greenAccent[500], 0.2),
                                            p: 2,
                                            height: 70,
                                            width: 70,
                                            boxShadow: `0 0 15px ${alpha(colors.greenAccent[500], 0.3)}`
                                        }}
                                    >
                                        <SupervisorAccountOutlinedIcon sx={{ color: colors.greenAccent[500], fontSize: "40px" }} />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card
                            elevation={4}
                            sx={{
                                gridColumn: "span 3",
                                backgroundColor: alpha(colors.primary[400], 0.9),
                                borderRadius: 3,
                                overflow: "hidden",
                                position: "relative",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: theme.shadows[10],
                                }
                            }}
                        >
                            <Box sx={{ position: "absolute", top: 0, left: 0, width: "5px", height: "100%", backgroundColor: colors.greenAccent[500] }} />
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack spacing={1}>
                                        <Typography variant="h3" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                                            {totalCitoyens}
                                        </Typography>
                                        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                                            Citoyens
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(colors.greenAccent[500], 0.2),
                                            p: 2,
                                            height: 70,
                                            width: 70,
                                            boxShadow: `0 0 15px ${alpha(colors.greenAccent[500], 0.3)}`
                                        }}
                                    >
                                        <GroupIcon sx={{ color: colors.greenAccent[500], fontSize: "40px" }} />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card
                            elevation={4}
                            sx={{
                                gridColumn: "span 3",
                                backgroundColor: alpha(colors.primary[400], 0.9),
                                borderRadius: 3,
                                overflow: "hidden",
                                position: "relative",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: theme.shadows[10],
                                }
                            }}
                        >
                            <Box sx={{ position: "absolute", top: 0, left: 0, width: "5px", height: "100%", backgroundColor: colors.greenAccent[500] }} />
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack spacing={1}>
                                        <Typography variant="h3" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                                            {totalReclamations}
                                        </Typography>
                                        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                                            Reclamations
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(colors.greenAccent[500], 0.2),
                                            p: 2,
                                            height: 70,
                                            width: 70,
                                            boxShadow: `0 0 15px ${alpha(colors.greenAccent[500], 0.3)}`
                                        }}
                                    >
                                        <ReportIcon sx={{ color: colors.greenAccent[500], fontSize: "40px" }} />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card
                            elevation={4}
                            sx={{
                                gridColumn: "span 3",
                                backgroundColor: alpha(colors.primary[400], 0.9),
                                borderRadius: 3,
                                overflow: "hidden",
                                position: "relative",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: theme.shadows[10],
                                }
                            }}
                        >
                            <Box sx={{ position: "absolute", top: 0, left: 0, width: "5px", height: "100%", backgroundColor: colors.greenAccent[500] }} />
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack spacing={1}>
                                        <Typography variant="h3" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                                            {totalRegions}
                                        </Typography>
                                        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
                                            Regions
                                        </Typography>
                                    </Stack>
                                    <Avatar
                                        sx={{
                                            bgcolor: alpha(colors.greenAccent[500], 0.2),
                                            p: 2,
                                            height: 70,
                                            width: 70,
                                            boxShadow: `0 0 15px ${alpha(colors.greenAccent[500], 0.3)}`
                                        }}
                                    >
                                        <PlaceIcon sx={{ color: colors.greenAccent[500], fontSize: "40px" }} />
                                    </Avatar>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                    )}

                    {/* ROW 2 */}
                    <Card
                        elevation={4}
                        sx={{
                            gridColumn: "span 7",
                            gridRow: "span 2",
                            backgroundColor: alpha(colors.primary[400], 0.9),
                            borderRadius: 3,
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: theme.shadows[8],
                            }
                        }}
                    >
                        <CardContent sx={{ p: 3, height: "100%" }}>
                            <Typography variant="h5" fontWeight="600" sx={{ mb: 2, color: colors.grey[100] }}>
                                Évolution des Réclamations
                            </Typography>
                            <Divider sx={{ mb: 3, backgroundColor: alpha(colors.greenAccent[500], 0.3) }} />
                            <Box height="85%" display="flex" flexDirection="column" justifyContent="center">
                                <LineChart isDashboard={true} />
                            </Box>
                        </CardContent>
                    </Card>

                    <Card
                        elevation={4}
                        sx={{
                            gridColumn: "span 5",
                            gridRow: "span 2",
                            backgroundColor: alpha(colors.primary[400], 0.9),
                            borderRadius: 3,
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: theme.shadows[8],
                            }
                        }}
                    >
                        <CardContent sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}>
                            <Box
                                display="flex"
                                justifyContent="start"
                                gap="5px"
                                alignItems="center"
                                borderBottom={`2px solid ${alpha(colors.primary[500], 0.5)}`}
                                p="15px"
                                sx={{ backgroundColor: alpha(colors.primary[400], 0.3) }}
                            >
                                <NotificationImportantIcon sx={{ color: colors.greenAccent[500], mr: 1 }} />
                                <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                                    Réclamations urgentes
                                </Typography>
                            </Box>

                            <Box sx={{
                                overflowY: "auto",
                                flex: 1,
                                '&::-webkit-scrollbar': {
                                    width: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: alpha(colors.primary[500], 0.2),
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: colors.greenAccent[500],
                                    borderRadius: '4px',
                                    '&:hover': {
                                        backgroundColor: colors.greenAccent[400],
                                    }
                                }
                            }}>
                                {urgentsReclamation.map((rec, i) => (
                                    <Box
                                        onClick={() => handleViewDetails(rec.id)}
                                        key={`${rec.id}-${i}`}
                                        sx={{
                                            p: "15px",
                                            borderBottom: `1px solid ${alpha(colors.primary[500], 0.5)}`,
                                            transition: "all 0.2s ease",
                                            cursor: "pointer",
                                            "&:hover": {
                                                backgroundColor: alpha(colors.primary[500], 0.3),
                                            }
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack spacing={1}>
                                                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                                                    {rec.titre}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <PlaceIcon sx={{ color: colors.grey[300], fontSize: "16px" }} />
                                                    <Typography color={colors.grey[300]} variant="body2">
                                                        {rec.region}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Chip
                                                    label={`${rec.date_de_creation}`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha(colors.grey[100], 0.1),
                                                        color: colors.grey[100]
                                                    }}
                                                />
                                                <Chip
                                                    label={`${rec.nombre_de_votes} votes`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: colors.greenAccent[500],
                                                        color: colors.primary[600],
                                                        fontWeight: "bold"
                                                    }}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>

                    {/* ROW 3 */}
                    <Card
                        elevation={4}
                        sx={{
                            gridColumn: isSuperAdmin ? "span 4" : "span 7",
                            gridRow: "span 2",
                            backgroundColor: alpha(colors.primary[400], 0.9),
                            borderRadius: 3,
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: theme.shadows[8],
                            }
                        }}
                    >
                        <CardContent sx={{ p: 3, height: "100%" }}>
                            <Typography variant="h5" fontWeight="600" sx={{ mb: 2, color: colors.grey[100] }}>
                                Distribution des Réclamations
                            </Typography>
                            <Divider sx={{ mb: 3, backgroundColor: alpha(colors.greenAccent[500], 0.3) }} />
                            <Box height="85%" display="flex" flexDirection="column" justifyContent="center">
                                <DoughnutChart isDashboard={true} />
                            </Box>
                        </CardContent>
                    </Card>

                    {isSuperAdmin && (
                        <Card
                            elevation={4}
                            sx={{
                                gridColumn: "span 4",
                                gridRow: "span 2",
                                backgroundColor: alpha(colors.primary[400], 0.9),
                                borderRadius: 3,
                                overflow: "hidden",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-3px)",
                                    boxShadow: theme.shadows[8],
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3, height: "100%" }}>
                                <Typography variant="h5" fontWeight="600" sx={{ mb: 2, color: colors.grey[100] }}>
                                    Analyse des Données
                                </Typography>
                                <Divider sx={{ mb: 3, backgroundColor: alpha(colors.greenAccent[500], 0.3) }} />
                                <Box height="85%" display="flex" flexDirection="column" justifyContent="center">
                                    <BarChart isDashboard={true} />
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    <Card
                        elevation={4}
                        onClick={() => navigate("/map")}
                        sx={{
                            gridColumn: isSuperAdmin ? "span 4" : "span 5",
                            gridRow: "span 2",
                            backgroundColor: alpha(colors.primary[400], 0.9),
                            borderRadius: 3,
                            overflow: "hidden",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: theme.shadows[8],
                                "& .hover-icon": {
                                    transform: "translateX(5px)",
                                }
                            }
                        }}
                    >
                        <CardContent sx={{ p: 3, height: "100%" }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                                    Carte Interactive
                                </Typography>
                                <IconButton className="hover-icon" sx={{
                                    color: colors.greenAccent[500],
                                    transition: "all 0.3s ease"
                                }}>
                                    <ArrowForwardIcon />
                                </IconButton>
                            </Stack>
                            <Divider sx={{ mb: 3, backgroundColor: alpha(colors.greenAccent[500], 0.3) }} />
                            <Tooltip title="Cliquez pour accéder à la carte interactive">
                                <Box height="80%" display="flex" justifyContent="center" alignItems="center">
                                    <img
                                        src={MapOfMorocco}
                                        alt="Carte du Maroc"
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "100%",
                                            objectFit: "contain",
                                            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                                        }}
                                    />
                                </Box>
                            </Tooltip>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;