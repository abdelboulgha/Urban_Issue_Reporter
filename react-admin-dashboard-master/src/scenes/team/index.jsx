import { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import LoopOutlinedIcon from "@mui/icons-material/LoopOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import axios from "axios";

const Reclamations = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get("http://localhost:3000/api/reclamations");
        
        // Vérification de la structure de réponse
        if (!response.data?.reclamations) {
          throw new Error("Structure de données inattendue");
        }

        // Transformation des données pour correspondre au DataGrid
        const formattedData = response.data.reclamations.map(item => ({
          id: item.id,
          date_de_creation: item.date_de_creation,
          titre: item.titre,
          description: item.description,
          categorie: `Catégorie ${item.categorieId}`, // À adapter si vous avez les noms de catégories
          citoyen: `Citoyen ${item.citoyenId}`, // À adapter si vous avez les noms de citoyens
          nombre_de_votes: item.nombre_de_votes,
          localisation: item.localisation,
          statut: item.statut
        }));
        console.log(formattedData);
        setReclamations(formattedData);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message || "Erreur lors de la récupération des données");
      } finally {
        setLoading(false);
      }
    };

    fetchReclamations();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "date_de_creation",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => (
        <Typography>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      )
    },
    {
      field: "titre",
      headerName: "Titre",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      renderCell: (params) => (
        <Typography variant="body2" noWrap title={params.value}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "categorie",
      headerName: "Catégorie",
      flex: 1,
    },
    {
      field: "citoyen",
      headerName: "Citoyen",
      flex: 1,
    },
    {
      field: "nombre_de_votes",
      headerName: "Votes",
      type: "number",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "localisation",
      headerName: "Localisation",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <LocationOnOutlinedIcon fontSize="small" />
          <Typography sx={{ ml: "5px" }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "statut",
      headerName: "Statut",
      flex: 1,
      renderCell: ({ value }) => {
        const statusConfig = {
          en_attente: {
            color: colors.blueAccent[600],
            icon: <PendingOutlinedIcon />,
            label: "En attente"
          },
          en_cours: {
            //color: colors.orangeAccent[600],
            icon: <LoopOutlinedIcon />,
            label: "En cours"
          },
          résolue: {
            color: colors.greenAccent[600],
            icon: <CheckCircleOutlineOutlinedIcon />,
            label: "Résolue"
          },
          rejetée: {
            color: colors.redAccent[600],
            icon: <CancelOutlinedIcon />,
            label: "Rejetée"
          }
        };

        const config = statusConfig[value] || {
          color: colors.grey[500],
          icon: <PendingOutlinedIcon />,
          label: value
        };

        return (
          <Box
            width="80%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={config.color}
            borderRadius="4px"
          >
            {config.icon}
            <Typography color={colors.grey[100]} sx={{ ml: "5px", textTransform: "capitalize" }}>
              {config.label}
            </Typography>
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box m="20px">
        <Header title="RÉCLAMATIONS" subtitle="Chargement en cours..." />
        <Box display="flex" justifyContent="center" mt={5}>
          <Typography variant="h6">Chargement des réclamations...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Header title="RÉCLAMATIONS" subtitle="Erreur de chargement" />
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Réessayer
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="RÉCLAMATIONS" subtitle="Gestion des réclamations des citoyens" />
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
        }}
      >
        <DataGrid
          rows={reclamations}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Reclamations;