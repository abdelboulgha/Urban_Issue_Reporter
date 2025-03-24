const categorieSchema  = require('../models/categorieSchema');

// Service to handle creating a category
const createCategorie = async ({ libelle, description }) => {
  try {
    const categorie = await categorieSchema.create({
      libelle,
      description
    });

    return categorie;
  } catch (error) {
    throw new Error('Erreur lors de la création de la catégorie : ' + error.message);
  }
};

module.exports = { createCategorie };
