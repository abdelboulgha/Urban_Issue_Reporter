const  categorieSchema  = require('../models/categorieSchema');

// Service to get all categories
const getCategories = async () => {
  try {
    const categories = await categorieSchema.findAll();
    return categories;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des catégories : ' + error.message);
  }
};

// Service to get a single category by ID
const getCategorieById = async (id) => {
  try {
    const categorie = await categorieSchema.findByPk(id);

    if (!categorie) {
      throw new Error('Catégorie non trouvée');
    }

    return categorie;
  } catch (error) {
    throw new Error('Erreur lors de la récupération de la catégorie : ' + error.message);
  }
};
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

// Service to update a category by ID
const updateCategorie = async (id, { libelle, description }) => {
  try {
    const categorie = await categorieSchema.findByPk(id);

    if (!categorie) {
      throw new Error('Catégorie non trouvée');
    }

    // Update fields
    categorie.libelle = libelle || categorie.libelle;
    categorie.description = description || categorie.description;

    // Save changes
    await categorie.save();

    return categorie;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de la catégorie : ' + error.message);
  }
};

// Service to delete a category by ID
const deleteCategorie = async (id) => {
  try {
    const categorie = await categorieSchema.findByPk(id);

    if (!categorie) {
      throw new Error('Catégorie non trouvée');
    }

    // Delete category
    await categorie.destroy();

    return { message: 'Catégorie supprimée avec succès' };
  } catch (error) {
    throw new Error('Erreur lors de la suppression de la catégorie : ' + error.message);
  }
};




module.exports = { getCategories, getCategorieById, createCategorie, updateCategorie, deleteCategorie };
