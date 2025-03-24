const { photoSchema } = require('../models/photoSchema'); // ajuste le chemin si nécessaire

// Service to handle creating a photo
const createPhoto = async ({ url }) => {
  try {
    const newPhoto = await photoSchema.create({ url });
    return newPhoto;
  } catch (error) {
    throw new Error('Erreur lors de la création de la photo : ' + error.message);
  }
};

module.exports = { createPhoto };
