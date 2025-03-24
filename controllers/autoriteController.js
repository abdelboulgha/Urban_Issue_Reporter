const autoriteService = require('../services/autoriteService');

// Controller to handle the creation of an autorité
const createAutorite = async (req, res) => {
  try {
    const { nom, description } = req.body;

    // Call the service to create the autorité
    const newAutorite = await autoriteService.createAutorite({ nom, description });

    // Respond with the newly created autorité
    res.status(201).json({
      message: 'Autorité créée avec succès',
      autorite: newAutorite
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de l\'autorité',
      error: error.message
    });
  }
};

module.exports = { createAutorite };
