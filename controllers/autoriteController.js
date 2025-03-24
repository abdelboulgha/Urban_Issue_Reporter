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
      autorite: newAutorite,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de l\'autorité',
      error: error.message,
    });
  }
};

// Controller to handle retrieval of all autorités
const getAllAutorites = async (req, res) => {
  try {
    const autorites = await autoriteService.getAllAutorites();

    res.status(200).json({
      message: 'Liste des autorités récupérée avec succès',
      autorites,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des autorités',
      error: error.message,
    });
  }
};

// Controller to handle retrieval of an autorité by ID
const getAutoriteById = async (req, res) => {
  try {
    const { id } = req.params;

    const autorite = await autoriteService.getAutoriteById(id);

    res.status(200).json({
      message: 'Autorité récupérée avec succès',
      autorite,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Erreur lors de la récupération de l\'autorité',
      error: error.message,
    });
  }
};

// Controller to handle updating of an autorité
const updateAutorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description } = req.body;

    const updatedAutorite = await autoriteService.updateAutorite(id, { nom, description });

    res.status(200).json({
      message: 'Autorité mise à jour avec succès',
      autorite: updatedAutorite,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Erreur lors de la mise à jour de l\'autorité',
      error: error.message,
    });
  }
};

// Controller to handle deletion of an autorité
const deleteAutorite = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await autoriteService.deleteAutorite(id);

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Erreur lors de la suppression de l\'autorité',
      error: error.message,
    });
  }
};

module.exports = {
  createAutorite,
  getAllAutorites,
  getAutoriteById,
  updateAutorite,
  deleteAutorite,
};