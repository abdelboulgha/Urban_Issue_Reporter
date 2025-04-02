const { reclamationSchema } = require('../models/reclamationSchema'); // Adjust path if needed
const regionSchema = require("../models/regionSchema");

const  Categorie  = require('../models/categorieSchema');
const {Sequelize} = require("sequelize"); // Ensure correct import

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

const getReclamationsByStatus = async () => {
  try {
    return await reclamationSchema.findAll({
      attributes: ['statut', [Sequelize.fn('COUNT', Sequelize.col('statut')), 'count']],
      group: ['statut']
    });
  } catch (error) {
    throw new Error('Error fetching reclamations by status: ' + error.message);
  }
};

const getReclamationsByMonth = async (year) => {
  try {
    return await reclamationSchema.findAll({
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('date_de_creation')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: Sequelize.where(
          Sequelize.fn('YEAR', Sequelize.col('date_de_creation')),
          year
      ),
      group: [Sequelize.fn('MONTH', Sequelize.col('date_de_creation'))],
      order: [[Sequelize.fn('MONTH', Sequelize.col('date_de_creation'))]],
    });
  } catch (error) {
    throw new Error('Error fetching reclamations by month: ' + error.message);
  }
};

const getReclamationsCount = async () => {
  try {
    const count = await reclamationSchema.count();
    return { totalReclamations: count };
  } catch (error) {
    throw new Error('Error fetching total reclamations count: ' + error.message);
  }
};

const getReclamationsByRegion = async () => {
  try {
    return await reclamationSchema.findAll({
      attributes: ['regionId', [Sequelize.fn('COUNT', Sequelize.col('regionId')), 'count']],
      group: ['regionId'],
      include: [{
        model: regionSchema,
        attributes: ['nom'] // Assurez-vous que la colonne s'appelle bien 'nom' dans la table Region
      }]
    });
  } catch (error) {
    throw new Error('Erreur lors de la récupération des réclamations par région: ' + error.message);
  }
};

const getTopThreeUrgentsReclamations = async () => {
  try {
    return await reclamationSchema.findAll({
      attributes: {exclude: []}, // This means include all attributes
      where: {
        statut: 'en_attente' // Filter by status
      },
      order: [['nombre_de_votes', 'DESC']], // Sort by votes in descending order
      limit: 3, // Limit to the top 3
      include: [{
        model: regionSchema,
        attributes: ['nom'] // Assuming 'nom' is the column name for the region name in regionSchema
      }]
    });
  } catch (error) {
    throw new Error('Error fetching top 3 reclamations: ' + error.message);
  }
};

module.exports = { 
  createReclamation,
  getAllReclamations,
  getReclamationById,
  updateReclamation,
  deleteReclamation,
  getReclamationsByStatus,
  getReclamationsByMonth,
  getReclamationsCount,
  getReclamationsByRegion,
  getTopThreeUrgentsReclamations
};
