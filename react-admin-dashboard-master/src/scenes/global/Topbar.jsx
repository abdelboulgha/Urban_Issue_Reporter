import {
  Box,
  IconButton,
  useTheme,
  Modal,
  Avatar,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Divider
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import axios from "axios";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const response = await axios.get('http://localhost:3000/api/admins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.admins && response.data.admins.length > 0) {
        const currentAdmin = response.data.admins.find(admin => admin.id === userData.id);

        if (currentAdmin) {
          setAdmin({
            ...currentAdmin,
            region: currentAdmin.Region?.nom || "Non assigné"
          });
        } else {
          throw new Error('Admin non trouvé');
        }
      } else {
        throw new Error('Aucun admin trouvé');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    if (!admin) {
      fetchAdminData();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getInitials = () => {
    return (admin?.prenom?.charAt(0) || "") + (admin?.nom?.charAt(0) || "");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* Search functionality can be added here if needed */}
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>

        <IconButton onClick={handleOpen}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* ADMIN INFO MODAL */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-admin-info"
        aria-describedby="modal-admin-description"
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 450,
            boxShadow: 24,
            p: 0,
            borderRadius: 2,
            outline: 'none',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <Box 
            sx={{ 
              p: 3, 
              bgcolor: colors.primary[400],
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              position: 'relative'
            }}
          >
            <Typography variant="h4" textAlign="center" fontWeight="bold">
              Information du Profil
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box textAlign="center">
                <Typography color="error" gutterBottom>
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={fetchAdminData}
                  sx={{ mt: 2 }}
                >
                  Réessayer
                </Button>
              </Box>
            ) : admin ? (
              <>
                {/* Avatar and user info */}
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                  <Avatar 
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: colors.greenAccent[500],
                      fontSize: '2.5rem',
                      mb: 2
                    }}
                  >
                    {getInitials()}
                  </Avatar>
                  
                  <Box textAlign="center">
                    <Typography variant="h5" fontWeight="bold">
                      {admin.prenom} {admin.nom}
                    </Typography>
                    <Box 
                      sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        mt: 1,
                        bgcolor: admin.superAdmin ? colors.greenAccent[500] : colors.blueAccent[500],
                        borderRadius: 1,
                        color: '#fff'
                      }}
                    >
                      <Typography>
                        {admin.superAdmin ? "Super Administrateur" : "Administrateur"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Information display */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <BadgeOutlinedIcon sx={{ mr: 2, color: colors.grey[400], mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Nom complet
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {admin.prenom} {admin.nom}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <EmailOutlinedIcon sx={{ mr: 2, color: colors.grey[400], mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {admin.email}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <LocationOnOutlinedIcon sx={{ mr: 2, color: colors.grey[400], mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Région
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {admin.region}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Action */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    sx={{ 
                      px: 4,
                      bgcolor: colors.blueAccent[600], 
                      '&:hover': { bgcolor: colors.blueAccent[700] } 
                    }}
                  >
                    Fermer
                  </Button>
                </Box>
              </>
            ) : (
              <Typography>Aucune donnée disponible</Typography>
            )}
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default Topbar;