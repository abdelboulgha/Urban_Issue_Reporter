// middlewares/citoyenAuthMiddleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/citoyenAuthController');

// Middleware pour vérifier le token JWT des citoyens
const verifyCitoyenToken = (req, res, next) => {
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
    
    // Vérifier que c'est bien un citoyen
    if (decoded.role !== 'citoyen') {
      return res.status(403).json({ message: 'Accès refusé: Ce token n\'appartient pas à un citoyen' });
    }
    
    // Ajouter les infos du citoyen à l'objet request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = { verifyCitoyenToken };