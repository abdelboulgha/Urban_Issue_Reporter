const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');

router.post('/categorie', categorieController.createCategorie);       // Create
router.get('/categories', categorieController.getCategories);         // Read all
router.get('/categorie/:id', categorieController.getCategorieById);  // Read one
router.put('/categorie/:id', categorieController.updateCategorie);   // Update
router.delete('/categorie/:id', categorieController.deleteCategorie);// Delete

module.exports = router;