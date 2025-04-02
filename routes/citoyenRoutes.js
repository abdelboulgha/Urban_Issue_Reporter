const express = require('express');
const router = express.Router();
const citoyenController = require('../controllers/citoyenController');
const regionController = require("../controllers/regionController");

// CREATE - Create a new citoyen
router.post('/citoyen', citoyenController.createCitoyen);

// READ - Get all citoyens
router.get('/citoyens', citoyenController.getAllCitoyens);

// READ - Get a specific citoyen by ID
router.get('/citoyen/:id', citoyenController.getCitoyenById);

// UPDATE - Update a citoyen by ID
router.put('/citoyen/:id', citoyenController.updateCitoyen);

// DELETE - Delete a citoyen by ID
router.delete('/citoyen/:id', citoyenController.deleteCitoyen);

router.get("/citoyens-count", citoyenController.getCitoyensCount);

module.exports = router;

