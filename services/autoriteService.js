const autoriteSchema  = require('../models/autoriteSchema');
// Adjust the path if needed

// Create Autorité
const createAutorite = async ({ nom, description }) => {
  try {
    const autorite = await autoriteSchema.create({
      nom,
      description,
    });

    return autorite;
  } catch (error) {
    throw new Error('Erreur lors de la création de l\'autorité : ' + error.message);
  }
};

// Get All Autorités
const getAllAutorites = async () => {
  try {
    const autorites = await autoriteSchema.findAll();

    return autorites;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des autorités : ' + error.message);
  }
};

// Get Autorité by ID
const getAutoriteById = async (id) => {
  try {
    const autorite = await autoriteSchema.findByPk(id);

    if (!autorite) {
      throw new Error(`Autorité avec l'ID ${id} non trouvée`);
    }

    return autorite;
  } catch (error) {
    throw new Error('Erreur lors de la récupération de l\'autorité : ' + error.message);
  }
};

// Update Autorité
const updateAutorite = async (id, { nom, description }) => {
  try {
    const autorite = await autoriteSchema.findByPk(id);

    if (!autorite) {
      throw new Error(`Autorité avec l'ID ${id} non trouvée`);
    }

    // Update fields
    autorite.nom = nom || autorite.nom;
    autorite.description = description || autorite.description;

    await autorite.save();

    return autorite;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de l\'autorité : ' + error.message);
  }
};

// Delete Autorité
const deleteAutorite = async (id) => {
  try {
    const autorite = await autoriteSchema.findByPk(id);

    if (!autorite) {
      throw new Error(`Autorité avec l'ID ${id} non trouvée`);
    }

    await autorite.destroy();

    return { message: `Autorité avec l'ID ${id} a été supprimée avec succès` };
  } catch (error) {
    throw new Error('Erreur lors de la suppression de l\'autorité : ' + error.message);
  }
};

module.exports = {
  createAutorite,
  getAllAutorites,
  getAutoriteById,
  updateAutorite,
  deleteAutorite,
};