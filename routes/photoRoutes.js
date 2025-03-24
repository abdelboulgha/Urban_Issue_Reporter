const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

// Route to create a new citoyen
router.post('/photot', photoController.createPhoto);

module.exports = router;