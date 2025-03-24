const photoService = require('../services/photoService'); // ajuste le chemin si nécessaire

// Controller to handle the creation of a photo
const createPhoto = async (req, res) => {
  try {
    const { url } = req.body;

    const newPhoto = await photoService.createPhoto({ url });

    res.status(201).json({
      message: 'Photo créée avec succès',
      photo: newPhoto
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de la photo',
      error: error.message
    });
  }
};

module.exports = { createPhoto };
