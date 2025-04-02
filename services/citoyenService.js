const citoyenSchema = require('../models/citoyenSchema');
const regionSchema = require("../models/regionSchema"); // Adjust path if needed

// Create a new citoyen
const createCitoyen = async ({ nom, prenom, adresse, cin, email, telephone, password }) => {
  try {
    const citoyen = await citoyenSchema.create({
      nom,
      prenom,
      adresse,
      cin,
      email,
      telephone,
      password
    });
    return citoyen;
  } catch (error) {
    throw new Error('Error creating citoyen: ' + error.message);
  }
};

// Get all citoyens
const getAllCitoyens = async () => {
  try {
    return await Citoyen.findAll();
  } catch (error) {
    throw new Error('Error fetching citoyens: ' + error.message);
  }
};

// Get a citoyen by ID
const getCitoyenById = async (id) => {
  try {
    const citoyen = await citoyenSchema.findByPk(id);
    if (!citoyen) throw new Error('Citoyen not found');
    return citoyen;
  } catch (error) {
    throw new Error('Error fetching citoyen: ' + error.message);
  }
};

// Update a citoyen by ID
const updateCitoyen = async (id, updatedData) => {
  try {
    const citoyen = await citoyenSchema.findByPk(id);
    if (!citoyen) throw new Error('Citoyen not found');

    await citoyen.update(updatedData);
    return citoyen;
  } catch (error) {
    throw new Error('Error updating citoyen: ' + error.message);
  }
};

// Delete a citoyen by ID
const deleteCitoyen = async (id) => {
  try {
    const citoyen = await citoyenSchema.findByPk(id);
    if (!citoyen) throw new Error('Citoyen not found');

    await citoyen.destroy();
    return { message: 'Citoyen deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting citoyen: ' + error.message);
  }
};

const getCitoyensCount = async () => {
  try {
    const count = await citoyenSchema.count();
    return { totalCitoyens: count };
  } catch (error) {
    throw new Error('Error fetching total citoyens count: ' + error.message);
  }
};

module.exports = {
  createCitoyen,
  getAllCitoyens,
  getCitoyenById,
  updateCitoyen,
  deleteCitoyen,
  getCitoyensCount
};
