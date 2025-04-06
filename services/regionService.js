const regionSchema = require("../models/regionSchema");
// Adjust the path if needed

// Create Autorité
const createregion = async ({ nom, description }) => {
  try {
    const region = await regionSchema.create({
      nom,
      description,
    });

    return region;
  } catch (error) {
    throw new Error(
      "Erreur lors de la création de l'autorité : " + error.message
    );
  }
};

// Get All Autorités
const getAllregions = async () => {
  try {
    const regions = await regionSchema.findAll();

    return regions;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des autorités : " + error.message
    );
  }
};

// Get Autorité by ID
const getregionById = async (id) => {
  try {
    const region = await regionSchema.findByPk(id);

    if (!region) {
      throw new Error(`Autorité avec l'ID ${id} non trouvée`);
    }

    return region;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération de l'autorité : " + error.message
    );
  }
};

// Update Autorité
const updateregion = async (id, { nom, description }) => {
  try {
    const region = await regionSchema.findByPk(id);

    if (!region) {
      throw new Error(`Autorité avec l'ID ${id} non trouvée`);
    }

    // Update fields
    region.nom = nom || region.nom;
    region.description = description || region.description;

    await region.save();

    return region;
  } catch (error) {
    throw new Error(
      "Erreur lors de la mise à jour de l'autorité : " + error.message
    );
  }
};

// Delete Autorité
const deleteregion = async (id) => {
  try {
    const region = await regionSchema.findByPk(id);

    if (!region) {
      throw new Error(`Autorité avec l'ID ${id} non trouvée`);
    }

    await region.destroy();

    return { message: `Autorité avec l'ID ${id} a été supprimée avec succès` };
  } catch (error) {
    throw new Error(
      "Erreur lors de la suppression de l'autorité : " + error.message
    );
  }
};

const getRegionsCount = async () => {
  try {
    const count = await regionSchema.count();
    return { totalRegions: count };
  } catch (error) {
    throw new Error('Error fetching total regions count: ' + error.message);
  }
};

const getRegions = async () => {
  try {
    return await regionSchema.findAll({
      attributes: ['id', 'nom']
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createregion,
  getAllregions,
  getregionById,
  updateregion,
  deleteregion,
  getRegionsCount,
  getRegions
};
