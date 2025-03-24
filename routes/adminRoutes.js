const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to create a new admin
router.post('/admin', adminController.createAdmin);

// Route to get all admins
router.get('/admins', adminController.getAdmins);

// Route to get a single admin by ID
router.get('/admin/:id', adminController.getAdminById);

// Route to update an admin by ID
router.put('/admin/:id', adminController.updateAdmin);

// Route to delete an admin by ID
router.delete('/admin/:id', adminController.deleteAdmin);

module.exports = router;