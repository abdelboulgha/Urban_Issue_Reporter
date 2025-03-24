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

module.exports = {createCategorie };
