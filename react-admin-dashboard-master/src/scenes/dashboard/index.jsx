import {Box, Typography, useTheme} from "@mui/material";
import {tokens} from "../../theme";
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import GroupIcon from '@mui/icons-material/Group';
import ReportIcon from '@mui/icons-material/Report';
import PlaceIcon from '@mui/icons-material/Place';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import MapOfMorocco from "../../images/map-of-morocco.png";


import BarChart from "../../components/BarChart";
import {useEffect, useState} from "react";
import DoughnutChart from "../../components/DoughnutChart";
import axios from "axios";
import {useNavigate} from "react-router-dom";

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


    useEffect(() => {


    }, []);

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

    useEffect(() => {
        getAdminsCount();
        getReclamationsCount(userData.id);
        getCitoyensCount();
        getRegionsCount();
        getUrgentsReclamations(userData.id)

    }, []);
    // console.log(totalCitoyens);
    // console.log(totalAdmins);
    // console.log(totalReclamations);
    // console.log(totalRegions);
    // console.log(urgentsReclamation);

    return (
        // Container with scrollbar
        <Box
            sx={{
                height: "100vh",
                overflow: "auto",
            }}
        >
            <Box m="20px">
                {/* HEADER */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Header
                        title="TABLEAU DE BORD"
                        subtitle={
                            <>
                                Bienvenue{" "}
                                <span style={{color: "black", fontWeight: "bold"}}>{userData?.prenom}</span> sur votre
                                tableau de bord
                            </>
                        }
                    />

                    {/*<Box>*/}
                    {/*  <Button*/}
                    {/*    sx={{*/}
                    {/*      backgroundColor: colors.blueAccent[700],*/}
                    {/*      color: colors.grey[100],*/}
                    {/*      fontSize: "14px",*/}
                    {/*      fontWeight: "bold",*/}
                    {/*      padding: "10px 20px",*/}
                    {/*    }}*/}
                    {/*  >*/}
                    {/*    <DownloadOutlinedIcon sx={{ mr: "10px" }} />*/}
                    {/*    Download Reports*/}
                    {/*  </Button>*/}
                    {/*</Box>*/}
                </Box>

                {/* GRID & CHARTS */}
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(12, 1fr)"
                    gridAutoRows="200px"
                    gap="20px"
                >
                    {/* ROW 1 */}
                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="10%"
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                        >
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                sx={{color: colors.grey[100]}}
                            >
                                {totalAdmins}
                            </Typography>
                            <Typography variant="h4" sx={{color: colors.greenAccent[500]}}>
                                Admins
                            </Typography>
                        </Box>
                        <SupervisorAccountOutlinedIcon sx={{color: colors.greenAccent[500], fontSize: "75px"}}/>
                    </Box>

                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="10%"
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                        >
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                sx={{color: colors.grey[100]}}
                            >
                                {totalCitoyens}
                            </Typography>
                            <Typography variant="h4" sx={{color: colors.greenAccent[500]}}>
                                Citoyens
                            </Typography>
                        </Box>
                        <GroupIcon sx={{color: colors.greenAccent[500], fontSize: "75px"}}/>
                    </Box>

                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="10%"
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                        >
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                sx={{color: colors.grey[100]}}
                            >
                                {totalReclamations}
                            </Typography>
                            <Typography variant="h4" sx={{color: colors.greenAccent[500]}}>
                                Reclamations
                            </Typography>
                        </Box>
                        <ReportIcon sx={{color: colors.greenAccent[500], fontSize: "60px"}}/>
                    </Box>

                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="10%"
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                        >
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                sx={{color: colors.grey[100]}}
                            >
                                {totalRegions}
                            </Typography>
                            <Typography variant="h4" sx={{color: colors.greenAccent[500]}}>
                                Regions
                            </Typography>
                        </Box>
                        <PlaceIcon sx={{color: colors.greenAccent[500], fontSize: "50px"}}/>
                    </Box>


                    {/* ROW 2 */}
                    <Box
                        gridColumn="span 7"
                        gridRow="span 2"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        padding="30px"
                    >
                        <LineChart isDashboard={true}/>
                    </Box>
                    <Box
                        gridColumn="span 5"
                        gridRow="span 2"
                        backgroundColor={colors.primary[400]}
                        overflow="auto"
                        sx={{
                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: colors.primary[500],
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: colors.greenAccent[500],
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: colors.greenAccent[400],
                            },
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="start"
                            gap="5px"
                            alignItems="center"
                            borderBottom={`4px solid ${colors.primary[500]}`}
                            colors={colors.grey[100]}
                            p="15px"
                        >
                            <Typography
                                color={colors.grey[100]}
                                variant="h5"
                                fontWeight="600"
                            >
                                Réclamations urgentes
                            </Typography>
                            <NotificationImportantIcon sx={{color: colors.greenAccent[500]}}/>
                        </Box>
                        {urgentsReclamation.map((rec, i) => (
                            <Box
                                key={`${rec.id}-${i}`}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                borderBottom={`4px solid ${colors.primary[500]}`}
                                p="15px"
                            >
                                <Box>
                                    <Typography
                                        color={colors.greenAccent[500]}
                                        variant="h5"
                                        fontWeight="600"
                                    >
                                        {rec.titre}
                                    </Typography>
                                    <Typography color={colors.grey[100]}>
                                        {rec.region}
                                    </Typography>
                                </Box>
                                <Box color={colors.grey[100]}>{rec.date_de_creation}</Box>
                                <Box
                                    backgroundColor={colors.greenAccent[500]}
                                    p="5px 10px"
                                    borderRadius="4px"
                                >
                                    {rec.nombre_de_votes} votes
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {/* ROW 3 */}
                    <Box
                        gridColumn={isSuperAdmin ? "span 4" : "span 7"}
                        gridRow="span 2"
                        backgroundColor={colors.primary[400]}
                        p="30px"
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            height="100%"  // Make sure this is set
                        >
                            <DoughnutChart isDashboard={true}/>
                        </Box>
                    </Box>
                    {isSuperAdmin && (
                        <Box
                            gridColumn="span 4"
                            gridRow="span 2"
                            backgroundColor={colors.primary[400]}
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            paddingX="10px"
                            paddingY="30px"
                        >
                            <BarChart isDashboard={true}/>
                        </Box>
                    )}

                    <Box
                        gridColumn={isSuperAdmin ? "span 4" : "span 5"}
                        gridRow="span 2"
                        padding="30px"
                        onClick={() => navigate("/map")}
                        sx={{
                            cursor: "pointer",
                            "&:hover": { backgroundColor: colors.grey[900] }, // Optional hover effect
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight="600"
                            sx={{marginBottom: "15px"}}
                        >
                            Visiter la carte interactive
                        </Typography>
                        <Box height="100%">
                            <img
                                src={MapOfMorocco}
                                alt="Carte du Maroc"
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
