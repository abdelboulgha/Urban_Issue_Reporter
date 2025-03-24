const categorieService = require('../services/categorieService');

// Controller to handle the creation of a category
const createCategorie = async (req, res) => {
  try {
    const { libelle, description } = req.body;

    const newCategorie = await categorieService.createCategorie({ libelle, description });

    res.status(201).json({
      message: 'Catégorie créée avec succès',
      categorie: newCategorie
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de la catégorie',
      error: error.message
    });
  }
};

// Controller to get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await categorieService.getCategories();

    res.status(200).json({
      message: 'Catégories récupérées avec succès',
      categories
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des catégories',
      error: error.message
    });
  }
};

// Controller to get a single category by ID
const getCategorieById = async (req, res) => {
  try {
    const { id } = req.params;

    const categorie = await categorieService.getCategorieById(id);

    res.status(200).json({
      message: 'Catégorie récupérée avec succès',
      categorie
    });
  } catch (error) {
    res.status(404).json({
      message: 'Erreur lors de la récupération de la catégorie',
      error: error.message
    });
  }
};

// Controller to update a category
const updateCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    const { libelle, description } = req.body;

    const updatedCategorie = await categorieService.updateCategorie(id, { libelle, description });

    res.status(200).json({
      message: 'Catégorie mise à jour avec succès',
      categorie: updatedCategorie
    });
  } catch (error) {
    res.status(404).json({
      message: 'Erreur lors de la mise à jour de la catégorie',
      error: error.message
    });
  }
};

// Controller to delete a category
const deleteCategorie = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await categorieService.deleteCategorie(id);

    res.status(200).json({
      message: result.message
    });
  } catch (error) {
    res.status(404).json({
      message: 'Erreur lors de la suppression de la catégorie',
      error: error.message
    });
  }
};

// Export all controllers
module.exports = {
  createCategorie,
  getCategories,
  getCategorieById,
  updateCategorie,
  deleteCategorie
};