// controllers/citoyenAuthController.js
const citoyenService = require('../services/citoyenService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// JWT Secret pour les citoyens (à définir dans le service ou dans un fichier de configuration)
const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt_pour_citoyens';

// Contrôleur pour gérer la connexion des citoyens (sign in)
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    // Trouver le citoyen par email
    const citoyen = await citoyenService.getCitoyenByEmail(email);
    
    if (!citoyen) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, citoyen.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }
    
    // Générer un token JWT
    const token = jwt.sign(
      { 
        id: citoyen.id,
        email: citoyen.email,
        role: 'citoyen'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Exclure le mot de passe de la réponse
    const { password: _, ...citoyenWithoutPassword } = citoyen.toJSON();
    
    res.status(200).json({
      message: 'Connexion réussie',
      citoyen: citoyenWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Échec de la connexion',
      error: error.message
    });
  }
};

// Contrôleur pour l'inscription des citoyens (sign up)
const signup = async (req, res) => {
  try {
    const { nom, prenom, adresse, cin, email, telephone, password } = req.body;
    
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: 'Les champs obligatoires sont requis' });
    }
    
    // Vérifier si l'email existe déjà
    const existingCitoyen = await citoyenService.getCitoyenByEmail(email);
    
    if (existingCitoyen) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Créer le citoyen
    const newCitoyen = await citoyenService.createCitoyen({
      nom,
      prenom,
      adresse,
      cin,
      email,
      telephone,
      password // Le hachage sera fait dans le service
    });
    
    // Générer un token JWT
    const token = jwt.sign(
      { 
        id: newCitoyen.id,
        email: newCitoyen.email,
        role: 'citoyen'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Exclure le mot de passe de la réponse
    const { password: _, ...citoyenWithoutPassword } = newCitoyen.toJSON();
    
    res.status(201).json({
      message: 'Inscription réussie',
      citoyen: citoyenWithoutPassword,
      token
    });
  } catch (error) {
    res.status(400).json({
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

module.exports = {
  signin,
  signup,
  JWT_SECRET
};