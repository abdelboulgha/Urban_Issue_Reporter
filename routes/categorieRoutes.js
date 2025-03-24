const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');

// Route to create a new citoyen
router.post('/categorie', categorieController.createCategorie);

module.exports = router;