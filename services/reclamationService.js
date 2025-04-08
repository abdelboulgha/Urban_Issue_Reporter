const { reclamationSchema } = require('../models/reclamationSchema'); // Adjust path if needed
const regionSchema = require("../models/regionSchema");

const  categorieSchema  = require('../models/categorieSchema');
const  adminSchema  = require('../models/adminSchema');
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
    const reclamation = await reclamationSchema.findByPk(id, {
      include: [
        {
          model: categorieSchema,
          attributes: ['libelle'], // Sélectionne uniquement le libellé de la catégorie
        },
        {
          model: regionSchema,
          attributes: ['nom'], // Sélectionne uniquement le libellé de la région
        },
      ],
    });

    if (!reclamation) {
      throw new Error('Réclamation non trouvée');
    }

    return reclamation;
  } catch (error) {
    throw new Error('Erreur lors de la récupération de la réclamation : ' + error.message);
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

const getReclamationsByStatus = async (adminId) => {
  try {
    // Find the admin to check if superAdmin
    const admin = await adminSchema.findByPk(adminId, {
      attributes: ['superAdmin', 'regionId'] // Retrieve only necessary fields
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const query = {
      attributes: ['statut', [Sequelize.fn('COUNT', Sequelize.col('statut')), 'count']],
      group: ['statut']
    };

    // If admin is not superAdmin, filter by regionId of the admin
    if (!admin.superAdmin) {
      query.where = { regionId: admin.regionId }; // Filter by admin's regionId
    }

    // Execute the query with the condition
    return await reclamationSchema.findAll(query);
  } catch (error) {
    throw new Error('Error fetching reclamations by status: ' + error.message);
  }
};


const getReclamationsByMonth = async (adminId, year) => {
  try {
    // Find the admin to check if superAdmin
    const admin = await adminSchema.findByPk(adminId, {
      attributes: ['superAdmin', 'regionId'] // Retrieve only necessary fields
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    // Start by defining the base where condition for year
    const whereCondition = Sequelize.and(
        Sequelize.where(
            Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM "date_de_creation"')),
            year
        )
    );

    // Add regionId condition if the admin is not superAdmin
    if (!admin.superAdmin && admin.regionId) {
      whereCondition.regionId = admin.regionId; // Filter by admin's region if not superAdmin
    }

    // Define the query
    const query = {
      attributes: [
        [Sequelize.literal('EXTRACT(MONTH FROM "date_de_creation")'), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: whereCondition, // Apply where condition for both year and regionId (if applicable)
      group: [Sequelize.literal('EXTRACT(MONTH FROM "date_de_creation")')],
      order: [[Sequelize.literal('EXTRACT(MONTH FROM "date_de_creation")')]],
    };

    // Execute the query
    return await reclamationSchema.findAll(query);
  } catch (error) {
    throw new Error('Error fetching reclamations by month: ' + error.message);
  }
};

const getReclamationsCount = async (adminId) => {
  try {
    // Fetch the admin's details to check if they are a superAdmin and their regionId
    const admin = await adminSchema.findOne({
      where: { id: adminId },
      attributes: ['superAdmin', 'regionId'],
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    // If the admin is a superAdmin, return the total count of reclamations
    if (admin.superAdmin) {
      const count = await reclamationSchema.count();
      return { totalReclamations: count };
    }

    // If the admin is not a superAdmin, return the count of reclamations in their region
    const count = await reclamationSchema.count({
      where: { regionId: admin.regionId },
    });

    return { totalReclamations: count };

  } catch (error) {
    throw new Error('Error fetching total reclamations count: ' + error.message);
  }
};


const getReclamationsByRegion = async () => {
  try {
    return await reclamationSchema.findAll({
      attributes: [
        'regionId',
        [Sequelize.fn('COUNT', Sequelize.col('regionId')), 'count']
      ],
      group: ['regionId', 'region.id'], // Include region.id in the GROUP BY clause
      include: [{
        model: regionSchema,
        attributes: ['id', 'nom'], // Select both 'id' and 'nom' to avoid the GROUP BY error
        required: true
      }]
    });
  } catch (error) {
    throw new Error('Erreur lors de la récupération des réclamations par région: ' + error.message);
  }
};

const getTopThreeUrgentsReclamations = async (adminId) => {
  try {
    // Find the admin to check if superAdmin
    const admin = await adminSchema.findByPk(adminId, {
      attributes: ['superAdmin', 'regionId'] // Retrieve only necessary fields
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    const query = {
      attributes: { exclude: [] }, // Include all attributes
      where: {
        statut: 'en_attente' // Filter by status 'en_attente'
      },
      order: [['nombre_de_votes', 'DESC']], // Sort by votes in descending order
      limit: 3, // Limit to the top 3
      include: [{
        model: regionSchema,
        attributes: ['nom'] // Assuming 'nom' is the column name for the region name
      }]
    };

    // If admin is not superAdmin, filter by regionId of the admin
    if (!admin.superAdmin) {
      query.where.regionId = admin.regionId; // Filter by admin's regionId
    }

    // Execute the query with the condition
    return await reclamationSchema.findAll(query);
  } catch (error) {
    throw new Error('Error fetching top 3 reclamations: ' + error.message);
  }
};

const getAllReclamationsByRegion = async (adminId) => {
  try {
    // Find the admin to check if superAdmin
    const admin = await adminSchema.findByPk(adminId, {
      attributes: ['superAdmin', 'regionId'] // Retrieve only necessary fields
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    // Base query setup
    const query = {
      where: {}
    };

    // If the admin is not a superAdmin, filter by regionId
    if (!admin.superAdmin && admin.regionId) {
      query.where.regionId = admin.regionId; // Only get reclamations from admin's region
    }

    // Execute the query
    return await reclamationSchema.findAll(query);
  } catch (error) {
    throw new Error('Error fetching reclamations: ' + error.message);
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
  getTopThreeUrgentsReclamations,
  getAllReclamationsByRegion
};
