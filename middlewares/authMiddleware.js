// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../services/adminService');

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  // Récupérer le token du header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accès non autorisé: Token manquant' });
  }
  
  // Extraire le token sans le "Bearer "
  const token = authHeader.split(' ')[1];
  
  try {
    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ajouter les infos de l'utilisateur à l'objet request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Middleware pour vérifier si l'utilisateur est un superAdmin
const isSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Utilisateur non authentifié' });
  }
  
  if (!req.user.superAdmin) {
    return res.status(403).json({ message: 'Accès refusé: Permissions superAdmin requises' });
  }
  
  next();
};

module.exports = { verifyToken, isSuperAdmin };