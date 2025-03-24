const express = require('express');
const router = express.Router();
const reclamationController = require('../controllers/reclamationController');

// Route to create a new reclamation
router.post('/reclamation', reclamationController.createReclamation);

// Route to get all reclamations
router.get('/reclamations', reclamationController.getAllReclamations);

// Route to get a specific reclamation by ID
router.get('/reclamation/:id', reclamationController.getReclamationById);

// Route to update a specific reclamation by ID
router.put('/reclamation/:id', reclamationController.updateReclamation);

// Route to delete a specific reclamation by ID
router.delete('/reclamation/:id', reclamationController.deleteReclamation);

module.exports = router;
