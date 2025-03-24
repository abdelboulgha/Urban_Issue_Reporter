const autoriteSchema  = require('../models/autoriteSchema'); // ajuste le chemin si nécessaire

// Service to create an Autorité
const createAutorite = async ({ nom, description }) => {
  try {
    const autorite = await autoriteSchema.create({
      nom,
      description
    });

    return autorite;
  } catch (error) {
    throw new Error('Erreur lors de la création de l\'autorité : ' + error.message);
  }
};

module.exports = { createAutorite };
