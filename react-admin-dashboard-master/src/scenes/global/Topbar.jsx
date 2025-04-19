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
  Divider,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Popover
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { io } from "socket.io-client";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();
  
  // États pour les notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const notifOpen = Boolean(notifAnchorEl);

  // Connexion au socket pour les notifications en temps réel
  // Dans votre useEffect qui gère la connexion socket
useEffect(() => {
  const socket = io("http://localhost:3000");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userRegionId = userData?.regionId;
  
  socket.on("connect", () => {
    console.log("Connecté au serveur Socket.IO");
  });
  
  socket.on("newReclamation", (reclamation) => {
    console.log("Nouvelle réclamation reçue:", reclamation);
    
    // Vérifier si la réclamation concerne la région de l'administrateur connecté
    if (reclamation.regionId === userRegionId || userData.superAdmin) {
      // Ajouter la nouvelle notification à la liste seulement si les régions correspondent
      // ou si l'utilisateur est un superAdmin
      const newNotification = {
        id: Date.now(),
        title: "Nouvelle réclamation",
        message: `${reclamation.titre}`,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        read: false,
        reclamationId: reclamation.id
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  });
  
  socket.on("disconnect", () => {
    console.log("Déconnecté du serveur Socket.IO");
  });
  
  // Nettoyage de la connexion socket à la fermeture du composant
  return () => {
    socket.disconnect();
  };
}, []);

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
  
  // Gestionnaires pour les notifications
  const handleNotificationClick = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotifAnchorEl(null);
    // Marquer toutes les notifications comme lues
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };
  
  const handleNotificationItemClick = (reclamationId) => {
    // Rediriger vers la page de détails de la réclamation
    console.log(`Redirection vers la réclamation ID: ${reclamationId}`);
    navigate(`/reclamation/${reclamationId}`)
    //window.location.href = `/reclamations/${reclamationId}`;
    //handleNotificationClose();
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
        
        {/* Notification Icon with Badge */}
        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        
        {/* Popover pour les notifications */}
        <Popover
          open={notifOpen}
          anchorEl={notifAnchorEl}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              width: 350,
              maxHeight: 500,
              mt: 0.5,
              boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
              borderRadius: 2
            }
          }}
        >
          <Box sx={{ bgcolor: colors.primary[400], p: 2 }}>
            <Typography variant="h6" fontWeight="bold">Notifications</Typography>
          </Box>
          
          <List sx={{ p: 0, overflowY: 'auto', maxHeight: 400 }}>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <ListItem 
                  key={notif.id}
                  divider
                  button
                  onClick={() => handleNotificationItemClick(notif.reclamationId)}
                  sx={{
                    bgcolor: notif.read ? 'transparent' : theme.palette.mode === 'dark' ? colors.primary[600] : colors.grey[100],
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? colors.primary[700] : colors.grey[200],
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: colors.greenAccent[500] }}>
                      <NotificationsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1" fontWeight={notif.read ? 'normal' : 'bold'}>
                        {notif.title}
                      </Typography>
                    } 
                    secondary={
                      <>
                        <Typography variant="body2" component="span" display="block">
                          {notif.message}
                        </Typography>
                        <Typography variant="caption" component="span" color="textSecondary">
                          {notif.date} à {notif.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">Aucune notification</Typography>
              </Box>
            )}
          </List>
          
          {notifications.length > 0 && (
            <Box sx={{ p: 2, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
              <Button 
                variant="text" 
                size="small"
                onClick={() => {
                  setNotifications([]);
                  setUnreadCount(0);
                }}
                sx={{ color: colors.blueAccent[400] }}
              >
                Effacer toutes les notifications
              </Button>
            </Box>
          )}
        </Popover>

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