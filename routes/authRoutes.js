// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour la connexion (login)
router.post('/login', authController.login);

// Route pour l'inscription (signup)
router.post('/signup', authController.signup);

module.exports = router;