const express = require('express');
const router = express.Router();
const autoriteController = require('../controllers/autoriteController');

// Route to create a new citoyen
router.post('/autorite', autoriteController.createAutorite);

module.exports = router;