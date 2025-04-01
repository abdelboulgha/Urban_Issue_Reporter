// controllers/authController.js
const adminService = require('../services/adminService');

// Contrôleur pour gérer la connexion (login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    const result = await adminService.loginAdmin(email, password);
    
    res.status(200).json({
      message: 'Connexion réussie',
      admin: result.admin,
      token: result.token
    });
  } catch (error) {
    res.status(401).json({
      message: 'Échec de la connexion',
      error: error.message
    });
  }
};

// Contrôleur pour l'inscription (sign up)
const signup = async (req, res) => {
  try {
    const { nom, prenom, email, password, superAdmin , regionId} = req.body;
    
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    const result = await adminService.createAdmin({ nom, prenom, email, password, superAdmin , regionId});
    
    res.status(201).json({
      message: 'Inscription réussie',
      admin: result.admin,
      token: result.token
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

module.exports = {
  login,
  signup
};