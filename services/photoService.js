const { photoSchema } = require('../models/photoSchema'); // Adjust path if needed
const { reclamationSchema } = require('../models/reclamationSchema'); // Import Reclamation schema

// CREATE - Create a new photo
const createPhoto = async ({ url, reclamationId }) => {
  try {
    // Check if the reclamationId exists in the reclamations table
    const reclamation = await reclamationSchema.findByPk(reclamationId);
    if (!reclamation) {
      throw new Error('Le reclamationId spécifié n\'existe pas dans la base de données.');
    }

    const newPhoto = await photoSchema.create({ url, reclamationId });
    return newPhoto;
  } catch (error) {
    throw new Error('Erreur lors de la création de la photo : ' + error.message);
  }
};

// READ - Get all photos
const getAllPhotos = async () => {
  try {
    return await photoSchema.findAll();
  } catch (error) {
    throw new Error('Erreur lors de la récupération des photos : ' + error.message);
  }
};

// READ - Get a single photo by ID
const getPhotoById = async (id) => {
  try {
    const photo = await photoSchema.findByPk(id);
    if (!photo) throw new Error('Photo non trouvée');
    return photo;
  } catch (error) {
    throw new Error('Erreur lors de la récupération de la photo : ' + error.message);
  }
};

// UPDATE - Update a photo by ID
const updatePhoto = async (id, updatedData) => {
  try {
    const photo = await photoSchema.findByPk(id);
    if (!photo) throw new Error('Photo non trouvée');

    await photo.update(updatedData);
    return photo;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de la photo : ' + error.message);
  }
};

// DELETE - Delete a photo by ID
const deletePhoto = async (id) => {
  try {
    const photo = await photoSchema.findByPk(id);
    if (!photo) throw new Error('Photo non trouvée');

    await photo.destroy();
    return { message: 'Photo supprimée avec succès' };
  } catch (error) {
    throw new Error('Erreur lors de la suppression de la photo : ' + error.message);
  }
};

// GET - Get all photos by reclamationId
const getPhotosByReclamationId = async (reclamationId) => {
  try {
    const photos = await photoSchema.findAll({
      where: { reclamationId }
    });
    return photos;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des photos par réclamation : ' + error.message);
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
