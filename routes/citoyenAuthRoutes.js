// routes/citoyenAuthRoutes.js
const express = require('express');
const router = express.Router();
const citoyenAuthController = require('../controllers/citoyenAuthController');

// Route pour la connexion des citoyens (sign in)
router.post('/signin', citoyenAuthController.signin);

// Route pour l'inscription des citoyens (sign up)
router.post('/signup', citoyenAuthController.signup);

module.exports = router;