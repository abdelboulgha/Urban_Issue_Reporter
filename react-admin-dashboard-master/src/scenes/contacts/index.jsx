import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const AdminContacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [admins, setAdmins] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    superAdmin: false,
    password: '',
    regionId: null
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [processing, setProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [adminsResponse, regionsResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/admins'),
          axios.get('http://localhost:3000/api/regions')
        ]);

        setAdmins(adminsResponse.data.admins || []);
        setRegions(regionsResponse.data.regions || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Erreur lors du chargement des données");
        showSnackbar("Erreur lors du chargement des données", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleEditClick = (admin) => {
    setCurrentAdmin(admin);
    setFormData({
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email,
      superAdmin: admin.superAdmin,
      password: '',
      regionId: admin.regionId || null
    });
    setEditOpen(true);
  };

  const handleAddClick = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      superAdmin: false,
      password: '',
      regionId: null
    });
    setAddOpen(true);
  };

  const handleDeleteClick = (admin) => {
    setCurrentAdmin(admin);
    setDeleteOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      setProcessing(true);

      const dataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        superAdmin: formData.superAdmin,
        regionId: formData.regionId
      };

      if (formData.password) {
        dataToSend.password = formData.password;
      }

      await axios.put(`http://localhost:3000/api/admin/${currentAdmin.id}`, dataToSend);
      showSnackbar("Personnel modifié avec succès", "success");
      const response = await axios.get('http://localhost:3000/api/admins');
      setAdmins(response.data.admins || []);
      setEditOpen(false);
    } catch (error) {
      console.error("Error updating admin:", error);
      const errorMsg = error.response?.data?.message || "Erreur lors de la modification";
      showSnackbar(errorMsg, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleAddSubmit = async () => {
    try {
      setProcessing(true);
      await axios.post('http://localhost:3000/api/admin', formData);
      showSnackbar("Personnel ajouté avec succès", "success");
      const response = await axios.get('http://localhost:3000/api/admins');
      setAdmins(response.data.admins || []);
      setAddOpen(false);
    } catch (error) {
      console.error("Error adding admin:", error);
      const errorMsg = error.response?.data?.message || "Erreur lors de l'ajout";
      showSnackbar(errorMsg, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log("Deleting admin:", currentAdmin.id);
      setProcessing(true);
      await axios.delete(`http://localhost:3000/api/admin/${currentAdmin.id}`);
      showSnackbar("Personnel supprimé avec succès", "success");
      const response = await axios.get('http://localhost:3000/api/admins');
      setAdmins(response.data.admins || []);
      setDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting admin:", error);
      const errorMsg = error.response?.data?.message || "Erreur lors de la suppression";
      showSnackbar(errorMsg, "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const columns = [
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
      field: "Region.nom",
      headerName: "Région",
      flex: 1,
      valueGetter: (params) => {
        // Vérifie plusieurs façons d'accéder au nom de la région
        return params.row.Region?.nom ||
               regions.find(r => r.id === params.row.regionId)?.nom ||
               "Non assigné";
      },
    },
    {
      field: "superAdmin",
      headerName: "Super Admin",
      flex: 0.75,
      renderCell: ({ row }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={
            row.superAdmin
              ? colors.greenAccent[600]
              : colors.redAccent[700]
          }
          borderRadius="4px"
        >
          {row.superAdmin ? "Oui" : "Non"}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditClick(row)}
            sx={{
              backgroundColor: colors.blueAccent[600],
              "&:hover": { backgroundColor: colors.blueAccent[700] }
            }}
          >

          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(row)}
            sx={{
              backgroundColor: colors.redAccent[700],
              "&:hover": { backgroundColor: colors.redAccent[800] }
            }}
          >

          </Button>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} color="error.main">
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", overflow: "auto" }}>
      <Box m="20px">
        <Header
          title="PERSONNELS"
          subtitle={`Liste des personnels (${admins.length})`}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              backgroundColor: colors.greenAccent[600],
              "&:hover": { backgroundColor: colors.greenAccent[700] }
            }}
          >
            Ajouter un personnel
          </Button>
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
            rows={admins}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            loading={loading}
            getRowId={(row) => row.id}
            localeText={{
              noRowsLabel: "Aucun personnel trouvé",
              toolbarDensity: "Densité",
              toolbarDensityLabel: "Densité",
              toolbarDensityCompact: "Compact",
              toolbarDensityStandard: "Standard",
              toolbarDensityComfortable: "Confortable",
            }}
          />
        </Box>
      </Box>

      {/* Dialog pour l'ajout */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">Ajouter un nouveau personnel</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Mot de passe"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Région"
              name="regionId"
              value={formData.regionId || ''}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value={null}>Non assigné</MenuItem>
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.nom}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.superAdmin}
                  onChange={handleInputChange}
                  name="superAdmin"
                  color="primary"
                />
              }
              label="Accès Super Admin"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setAddOpen(false)}
            variant="outlined"
            disabled={processing}
          >
            Annuler
          </Button>
          <Button
            onClick={handleAddSubmit}
            variant="contained"
            color="primary"
            disabled={processing}
            sx={{ ml: 2 }}
          >
            {processing ? <CircularProgress size={24} color="inherit" /> : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour la modification */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">Modifier le personnel</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
            />
            <TextField
              label="Nouveau mot de passe"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              placeholder="Laisser vide pour ne pas changer"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              label="Région"
              name="regionId"
              value={formData.regionId || ''}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value={null}>Non assigné</MenuItem>
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.nom}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.superAdmin}
                  onChange={handleInputChange}
                  name="superAdmin"
                  color="primary"
                />
              }
              label="Accès Super Admin"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setEditOpen(false)}
            variant="outlined"
            disabled={processing}
          >
            Annuler
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
            disabled={processing}
            sx={{ ml: 2 }}
          >
            {processing ? <CircularProgress size={24} color="inherit" /> : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour la suppression */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm">
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">Confirmer la suppression</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            Êtes-vous sûr de vouloir supprimer {currentAdmin?.prenom} {currentAdmin?.nom} ?
          </Typography>
          <Typography variant="body2" color="error">
            Cette action est irréversible et supprimera définitivement ce personnel.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            variant="outlined"
            disabled={processing}
          >
            Annuler
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={processing}
            sx={{ ml: 2 }}
          >
            {processing ? <CircularProgress size={24} color="inherit" /> : "Confirmer la suppression"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({...snackbar, open: false})}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminContacts;