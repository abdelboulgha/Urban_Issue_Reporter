import {Box, Button, Card, CardMedia, Typography, useTheme} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";


const Reclamation = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();

    const [reclamation, setReclamation] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReclamation = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/reclamation/${id}`);
                setReclamation(response.data.reclamation);
            } catch (err) {
                setError(err.response?.data?.message || 'Erreur lors de la récupération');
            } finally {
                setLoading(false);
            }
        };

        fetchReclamation();
    }, [id]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    console.log(reclamation);

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ color: "#1565c0" }}>{reclamation.reclamation.titre}</Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>{reclamation.reclamation.description}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#388e3c" }}>Statut: {reclamation.reclamation.statut}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#d32f2f" }}>Localisation: {reclamation.reclamation.localisation}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#0288d1" }}>Catégorie: {reclamation.reclamation.Categorie.libelle}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#7b1fa2" }}>Région: {reclamation.reclamation.region.nom}</Typography>
            <Card sx={{ width: "100%", mt: 2, borderRadius: "10px", boxShadow: 3 }}>
                <CardMedia
                    component="img"
                    height="150"
                    image={reclamation.image || "https://via.placeholder.com/400"}
                    alt="Image de la réclamation"
                />
            </Card>
        </Box>
    );
};

export default Reclamation;
