const { reclamationSchema } = require('../models/reclamationSchema'); // Adjust path if needed

const  Categorie  = require('../models/categorieSchema'); // Ensure correct import

const createReclamation = async ({
  titre,
  description,
  statut,
  localisation,
  nombre_de_votes = 0,
  citoyenId,
  categorieId,
  regionId// Optional: Handle case if categorieId is not passed or invalid
}) => {
  try {
    // Check if category exists
    if (categorieId) {
      const category = await Categorie.findByPk(categorieId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    const reclamation = await reclamationSchema.create({
      titre,
      description,
      statut,
      localisation,
      nombre_de_votes,
      citoyenId,
      categorieId,
      regionId
    });

    return reclamation;
  } catch (error) {
    throw new Error('Error creating reclamation: ' + error.message);
  }
};


// READ - Get all reclamations
const getAllReclamations = async () => {
  try {
    const reclamations = await reclamationSchema.findAll();
    return reclamations;
  } catch (error) {
    throw new Error('Error fetching reclamations: ' + error.message);
  }
};

// READ - Get a specific reclamation by ID
const getReclamationById = async (id) => {
  try {
    const reclamation = await reclamationSchema.findByPk(id);
    if (!reclamation) {
      throw new Error('Reclamation not found');
    }
    return reclamation;
  } catch (error) {
    throw new Error('Error fetching reclamation: ' + error.message);
  }
};

// UPDATE - Update a reclamation by ID
const updateReclamation = async (id, updateData) => {
  try {
    const reclamation = await reclamationSchema.findByPk(id);
    if (!reclamation) {
      throw new Error('Reclamation not found');
    }

    await reclamation.update(updateData);
    return reclamation;
  } catch (error) {
    throw new Error('Error updating reclamation: ' + error.message);
  }
};

// DELETE - Delete a reclamation by ID
const deleteReclamation = async (id) => {
  try {
    const reclamation = await reclamationSchema.findByPk(id);
    if (!reclamation) {
      throw new Error('Reclamation not found');
    }

    await reclamation.destroy();
    return { message: 'Reclamation deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting reclamation: ' + error.message);
  }
};

module.exports = { 
  createReclamation,
  getAllReclamations,
  getReclamationById,
  updateReclamation,
  deleteReclamation 
};
