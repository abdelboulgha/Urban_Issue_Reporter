const reclamationService = require('../services/reclamationService'); // Ensure correct path

// Controller to handle creation of a reclamation
const createReclamation = async (req, res) => {
  try {
    const { titre, description, statut, localisation, nombre_de_votes, citoyenId, categorieId,regionId } = req.body;

    // Call the service to create a reclamation
    const newReclamation = await reclamationService.createReclamation({
      titre,
      description,
      statut,
      localisation,
      nombre_de_votes,
      citoyenId, // Optional, depending on your logic
      categorieId,
      regionId, // Optional, depending on your logic
    });

    res.status(201).json({
      message: 'Réclamation créée avec succès',
      reclamation: newReclamation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de la réclamation',
      error: error.message
    });
  }
};

// Controller to get all reclamations
const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await reclamationService.getAllReclamations();
    res.status(200).json({
      message: 'Réclamations récupérées avec succès',
      reclamations,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des réclamations',
      error: error.message,
    });
  }
};

// Controller to get a specific reclamation by ID
const getReclamationById = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the ID is passed in the URL
    const reclamation = await reclamationService.getReclamationById(id);

    if (!reclamation) {
      return res.status(404).json({
        message: 'Réclamation non trouvée',
      });
    }

    res.status(200).json({
      message: 'Réclamation récupérée avec succès',
      reclamation,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération de la réclamation',
      error: error.message,
    });
  }
};

// Controller to update a reclamation
const updateReclamation = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request URL
    const { titre, description, statut, localisation, nombre_de_votes, citoyenId, categorieId,regionId } = req.body;

    // Call the service to update the reclamation
    const updatedReclamation = await reclamationService.updateReclamation(id, {
      titre,
      description,
      statut,
      localisation,
      nombre_de_votes,
      citoyenId,
      categorieId,
      regionId
    });

    if (!updatedReclamation) {
      return res.status(404).json({
        message: 'Réclamation non trouvée',
      });
    }

    res.status(200).json({
      message: 'Réclamation mise à jour avec succès',
      reclamation: updatedReclamation,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la réclamation',
      error: error.message,
    });
  }
};

// Controller to delete a reclamation
const deleteReclamation = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request URL

    const deletedReclamation = await reclamationService.deleteReclamation(id);

    if (!deletedReclamation) {
      return res.status(404).json({
        message: 'Réclamation non trouvée',
      });
    }

    res.status(200).json({
      message: 'Réclamation supprimée avec succès',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la réclamation',
      error: error.message,
    });
  }
};

module.exports = {
  createReclamation,
  getAllReclamations,
  getReclamationById,
  updateReclamation,
  deleteReclamation,
};
