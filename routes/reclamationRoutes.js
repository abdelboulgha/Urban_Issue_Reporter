const express = require('express');
const router = express.Router();
const reclamationController = require('../controllers/reclamationController');

// Route to create a new citoyen
router.post('/reclamation', reclamationController.createReclamation);

module.exports = router;