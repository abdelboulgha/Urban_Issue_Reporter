import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Footer from "./scenes/global/footer"; // Importez le composant Footer
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Authentification from "./components/authentification/Authentification";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null pour détecter l'état initial
  const location = useLocation();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true"); // Convertir en booléen
  }, []);

  // Si l'authentification est en cours de vérification, afficher un écran de chargement
  if (isAuthenticated === null) {
    return <div>Chargement...</div>;
  }

  // Si sur la page de login, afficher uniquement le formulaire d'authentification
  if (location.pathname === "/login") {
    return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Authentification onAuthenticate={() => {
            localStorage.setItem("isAuthenticated", "true");
            setIsAuthenticated(true);
          }} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    );
  }

  // Si non authentifié, rediriger vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Layout principal pour les utilisateurs authentifiés
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            <Topbar setIsSidebar={setIsSidebar} />
            <Box component="main" className="content" sx={{ flexGrow: 1, overflow: "auto" }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
