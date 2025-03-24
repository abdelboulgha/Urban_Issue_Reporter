const adminService = require('../services/adminService');

// Controller to handle the creation of an admin
const createAdmin = async (req, res) => {
  try {
    const { nom, prenom, email, password, superAdmin } = req.body;

    const newAdmin = await adminService.createAdmin({ nom, prenom, email, password, superAdmin });

    res.status(201).json({
      message: 'Admin créé avec succès',
      admin: newAdmin
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de l\'admin',
      error: error.message
    });
  }
};

// Controller to get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAdmins();

    res.status(200).json({
      message: 'Admins récupérés avec succès',
      admins
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des admins',
      error: error.message
    });
  }
};

// Controller to get a single admin by ID
const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await adminService.getAdminById(id);

    res.status(200).json({
      message: 'Admin récupéré avec succès',
      admin
    });
  } catch (error) {
    res.status(404).json({
      message: 'Erreur lors de la récupération de l\'admin',
      error: error.message
    });
  }
};

// Controller to update an admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, password, superAdmin } = req.body;

    const updatedAdmin = await adminService.updateAdmin(id, { nom, prenom, email, password, superAdmin });

    res.status(200).json({
      message: 'Admin mis à jour avec succès',
      admin: updatedAdmin
    });
  } catch (error) {
    res.status(404).json({
      message: 'Erreur lors de la mise à jour de l\'admin',
      error: error.message
    });
  }
};

// Controller to delete an admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await adminService.deleteAdmin(id);

    res.status(200).json({
      message: result.message
    });
  } catch (error) {
    res.status(404).json({
      message: 'Erreur lors de la suppression de l\'admin',
      error: error.message
    });
  }
};

// Export all controllers
module.exports = {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
};