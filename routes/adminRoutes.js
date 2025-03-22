const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to create a new citoyen
router.post('/admin', adminController.createAdmin);

module.exports = router;