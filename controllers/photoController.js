const photoService = require('../services/photoService'); // Adjust path if needed

// CREATE - Create a new photo
const createPhoto = async (req, res) => {
  try {
    const { url, reclamationId } = req.body;

    if (!url || !reclamationId) {
      return res.status(400).json({ message: 'URL et réclamation ID sont requis.' });
    }

    const newPhoto = await photoService.createPhoto({ url, reclamationId });

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

// READ - Get all photos
const getAllPhotos = async (req, res) => {
  try {
    const photos = await photoService.getAllPhotos();
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des photos',
      error: error.message
    });
  }
};

// READ - Get a photo by ID
const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await photoService.getPhotoById(id);
    res.status(200).json(photo);
  } catch (error) {
    res.status(404).json({
      message: 'Photo non trouvée',
      error: error.message
    });
  }
};

// UPDATE - Update a photo by ID
const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedPhoto = await photoService.updatePhoto(id, updatedData);

    res.status(200).json({
      message: 'Photo mise à jour avec succès',
      photo: updatedPhoto
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la photo',
      error: error.message
    });
  }
};

// DELETE - Delete a photo by ID
const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    await photoService.deletePhoto(id);

    res.status(200).json({
      message: 'Photo supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la photo',
      error: error.message
    });
  }
};

// READ - Get all photos by reclamationId
const getPhotosByReclamationId = async (req, res) => {
  try {
    const { reclamationId } = req.params;
    const photos = await photoService.getPhotosByReclamationId(reclamationId);
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des photos pour cette réclamation',
      error: error.message
    });
  }
};

module.exports = {
  createPhoto,
  getAllPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto,
  getPhotosByReclamationId
};
