const citoyenService = require('../services/citoyenService');
const adminService = require("../services/adminService");

// CREATE - Add a new citoyen
const createCitoyen = async (req, res) => {
  try {
    const { nom, prenom, adresse, cin, email, telephone, password } = req.body;
    const newCitoyen = await citoyenService.createCitoyen({ nom, prenom, adresse, cin, email, telephone, password });

    res.status(201).json({
      message: 'Citoyen created successfully',
      citoyen: newCitoyen
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating citoyen', error: error.message });
  }
};

// READ - Get all citoyens
const getAllCitoyens = async (req, res) => {
  try {
    const citoyens = await citoyenService.getAllCitoyens();
    res.status(200).json(citoyens);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching citoyens', error: error.message });
  }
};

// READ - Get a citoyen by ID
const getCitoyenById = async (req, res) => {
  try {
    const { id } = req.params;
    const citoyen = await citoyenService.getCitoyenById(id);
    res.status(200).json(citoyen);
  } catch (error) {
    res.status(404).json({ message: 'Citoyen not found', error: error.message });
  }
};

// UPDATE - Update a citoyen by ID
const updateCitoyen = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedCitoyen = await citoyenService.updateCitoyen(id, updatedData);
    res.status(200).json({
      message: 'Citoyen updated successfully',
      citoyen: updatedCitoyen
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating citoyen', error: error.message });
  }
};

// DELETE - Delete a citoyen by ID
const deleteCitoyen = async (req, res) => {
  try {
    const { id } = req.params;
    await citoyenService.deleteCitoyen(id);
    res.status(200).json({ message: 'Citoyen deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting citoyen', error: error.message });
  }
};

const getCitoyensCount = async (req, res) => {
  try {
    const countData = await citoyenService.getCitoyensCount();
    res.status(200).json({ message: 'Nombre total de citoyens récupéré', data: countData });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du nombre total de citoyens', error: error.message });
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
