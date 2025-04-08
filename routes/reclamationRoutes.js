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

router.get('/reclamations-by-status/:adminId', reclamationController.getReclamationsByStatus);

router.get('/reclamations-by-year/:adminId/:year', reclamationController.getReclamationsByYear);

router.get('/reclamations-count/:adminId', reclamationController.getReclamationsCount);
router.get('/reclamations-by-region', reclamationController.getReclamationsByRegion);
router.get('/urgents-reclamations/:adminId', reclamationController.getTopThreeUrgentsReclamations);
router.get('/all-reclamations-by-region/:adminId', reclamationController.getAllReclamationsByRegion);

module.exports = router;
