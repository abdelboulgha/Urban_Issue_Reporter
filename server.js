const express = require('express');
const bodyParser = require('body-parser');
const citoyenRoutes = require('./routes/citoyenRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes'); // Nouvelles routes d'authentification
const reclamationRoutes = require('./routes/reclamationRoutes');
const autoriteRoutes = require('./routes/autoriteRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const photoRoutes = require('./routes/photoRoutes');
const {sequelize} = require('./database/db');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());
// Middleware pour analyser les corps de requête JSON
app.use(bodyParser.json());

// Utiliser les routes de citoyen
app.use('/api', citoyenRoutes);
app.use('/api', adminRoutes);
app.use('/api/auth', authRoutes); // Routes d'authentification
app.use('/api', reclamationRoutes);
app.use('/api', autoriteRoutes);
app.use('/api', categorieRoutes); // Correction: ajout de la virgule manquante
app.use('/api', photoRoutes); // Correction: ajout de la virgule manquante

app.get("/api/sync", (req, res) => {
  sequelize.sync({ alter: true })
    .then(() => {
      console.log("Toutes les tables ont été synchronisées (créées/modifiées si nécessaire).");
      res.send("Toutes les tables ont été synchronisées (créées/modifiées si nécessaire)");
    })
    .catch(err => {
      console.error("Erreur lors de la synchronisation des tables:", err);
    });
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});