const express = require('express');
const router = express.Router();
const autoriteController = require('../controllers/autoriteController');

// Route to create a new autorité
router.post('/autorite', autoriteController.createAutorite);

// Route to get all autorités
router.get('/autorites', autoriteController.getAllAutorites);

// Route to get an autorité by ID
router.get('/autorite/:id', autoriteController.getAutoriteById);

// Route to update an autorité by ID
router.put('/autorite/:id', autoriteController.updateAutorite);

// Route to delete an autorité by ID
router.delete('/autorite/:id', autoriteController.deleteAutorite);

module.exports = router;