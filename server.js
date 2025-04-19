const express = require("express");
const bodyParser = require("body-parser");
const citoyenRoutes = require("./routes/citoyenRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes"); // Routes d'authentification
const reclamationRoutes = require("./routes/reclamationRoutes");
const regionRoutes = require("./routes/regionRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const photoRoutes = require("./routes/photoRoutes");
const { sequelize } = require("./database/db");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Configure CORS
const cors = require("cors");
app.use(cors());

// Setup Socket.IO after creating the server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Make io available throughout the application
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A client connected');
  
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Middleware pour analyser les corps de requête JSON
app.use(bodyParser.json());

// Utiliser les routes
app.use("/api", citoyenRoutes);
app.use("/api", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", reclamationRoutes);
app.use("/api", regionRoutes);
app.use("/api", categorieRoutes);
app.use("/api", photoRoutes);

// Route pour synchroniser la base de données
app.get("/api/sync", (req, res) => {
  sequelize
    .sync({ alter: true, force: true }) // Utiliser alter: true pour synchroniser les modèles
    .then(() => {
      console.log(
        "Toutes les tables ont été synchronisées (créées/modifiées si nécessaire)."
      );
      res.send(
        "Toutes les tables ont été synchronisées (créées/modifiées si nécessaire)"
      );
    })
    .catch((err) => {
      console.error("Erreur lors de la synchronisation des tables:", err);
      res.status(500).send("Erreur lors de la synchronisation des tables");
    });
});

// Start the server with Socket.IO
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});