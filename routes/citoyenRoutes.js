const express = require('express');
const router = express.Router();
const citoyenController = require('../controllers/citoyenController');

// Route to create a new citoyen
router.post('/citoyen', citoyenController.createCitoyen);

module.exports = router;
