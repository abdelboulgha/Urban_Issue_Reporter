import {
  Box,
  IconButton,
  useTheme,
  Modal,
  Avatar,
  Typography,
  CircularProgress,
  Button  // Ajoutez cette ligne
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
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

      // 1. Récupérez tous les admins
      const response = await axios.get('http://localhost:3000/api/admins', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // 2. Prenez le premier admin comme exemple
      if (response.data.admins && response.data.admins.length > 0) {
        const firstAdmin = response.data.admins.find(admin => admin.id === userData.id);

        setAdmin({
          ...firstAdmin,
          region: firstAdmin.Region?.nom || "Non assigné"
        });
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

  const handleClose = () => setOpen(false);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" /> */}
        {/* <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
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
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: 'none'
          }}
        >
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
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Avatar sx={{
                  width: 80,
                  height: 80,
                  bgcolor: colors.primary[500],
                  fontSize: '2rem'
                }}>
                  {admin.prenom?.charAt(0)}{admin.nom?.charAt(0)}
                </Avatar>

                <Typography variant="h5">
                  {admin.prenom} {admin.nom}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                  {admin.email}
                </Typography>

                <Box sx={{
                  px: 2,
                  py: 1,
                  bgcolor: admin.superAdmin ? colors.greenAccent[500] : colors.blueAccent[500],
                  borderRadius: 1
                }}>
                  <Typography>
                    {admin.superAdmin ? "Super Administrateur" : "Administrateur"}
                  </Typography>
                </Box>

                <Typography variant="body2">
                  <strong>Région:</strong> {admin.region}
                </Typography>
              </Box>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={fetchAdminData}
                >
                  Actualiser
                </Button>
              </Box>
            </>
          ) : (
            <Typography>Aucune donnée disponible</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Topbar;