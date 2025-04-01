const regionService = require("../services/regionService");

// Controller to handle the creation of an autorité
const createregion = async (req, res) => {
  try {
    const { nom, description } = req.body;

    // Call the service to create the autorité
    const newregion = await regionService.createregion({ nom, description });

    // Respond with the newly created autorité
    res.status(201).json({
      message: "Autorité créée avec succès",
      region: newregion,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'autorité",
      error: error.message,
    });
  }
};

// Controller to handle retrieval of all autorités
const getAllregions = async (req, res) => {
  try {
    const regions = await regionService.getAllregions();

    res.status(200).json({
      message: "Liste des autorités récupérée avec succès",
      regions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des autorités",
      error: error.message,
    });
  }
};

// Controller to handle retrieval of an autorité by ID
const getregionById = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await regionService.getregionById(id);

    res.status(200).json({
      message: "Autorité récupérée avec succès",
      region,
    });
  } catch (error) {
    res.status(404).json({
      message: "Erreur lors de la récupération de l'autorité",
      error: error.message,
    });
  }
};

// Controller to handle updating of an autorité
const updateregion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description } = req.body;

    const updatedregion = await regionService.updateregion(id, {
      nom,
      description,
    });

    res.status(200).json({
      message: "Autorité mise à jour avec succès",
      region: updatedregion,
    });
  } catch (error) {
    res.status(404).json({
      message: "Erreur lors de la mise à jour de l'autorité",
      error: error.message,
    });
  }
};

// Controller to handle deletion of an autorité
const deleteregion = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await regionService.deleteregion(id);

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    res.status(404).json({
      message: "Erreur lors de la suppression de l'autorité",
      error: error.message,
    });
  }
};

module.exports = {
  createregion,
  getAllregions,
  getregionById,
  updateregion,
  deleteregion,
};
