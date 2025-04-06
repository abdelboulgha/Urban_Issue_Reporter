// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isSuperAdmin } = require('../middlewares/authMiddleware');
const citoyenController = require("../controllers/citoyenController");

// Route pour créer un nouvel admin (protégée, seul un superAdmin peut le faire)
router.post('/admin', isSuperAdmin, adminController.createAdmin);


// Route pour obtenir tous les admins (protégée, seul un admin connecté peut le faire)
router.get('/admins', adminController.getAdmins);

// Route pour obtenir un admin par son ID (protégée)
router.get('/admin/:id', verifyToken, adminController.getAdminById);

// Route pour mettre à jour un admin par son ID (protégée)
router.put('/admin/:id', verifyToken, adminController.updateAdmin);

// Route pour supprimer un admin par son ID (protégée, seul un superAdmin peut le faire)
router.delete('/admin/:id', verifyToken, isSuperAdmin, adminController.deleteAdmin);

router.get("/admins-count", adminController.getAdminsCount);


module.exports = router;