const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

// Route to create a new photo
router.post('/photo', photoController.createPhoto);

// Route to get all photos
router.get('/photos', photoController.getAllPhotos);

// Route to get a specific photo by ID
router.get('/photo/:id', photoController.getPhotoById);

// Route to update a photo by ID
router.put('/photo/:id', photoController.updatePhoto);

// Route to delete a photo by ID
router.delete('/photo/:id', photoController.deletePhoto);

// Route to get photos by reclamationId
router.get('/photos/reclamation/:reclamationId', photoController.getPhotosByReclamationId);

module.exports = router;
