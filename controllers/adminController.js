// controllers/adminController.js
const adminService = require('../services/adminService');
const regionSchema = require("../models/regionSchema");
const regionService = require("../services/regionService");

// Contrôleur pour gérer la création d'un admin (déplacé vers authController)
const createAdmin = async (req, res) => {
  try {
    const { nom, prenom, email, password, superAdmin,regionId } = req.body;

    // Vérifier si l'utilisateur courant est un superAdmin (seul un superAdmin peut créer d'autres superAdmins)
    if (superAdmin && (!req.user || !req.user.superAdmin)) {
      return res.status(403).json({
        message: 'Seul un superAdmin peut créer un autre superAdmin'
      });
    }

    const result = await adminService.createAdmin({ nom, prenom, email, password, superAdmin,regionId });

    res.status(201).json({
      message: 'Admin créé avec succès',
      admin: result.admin
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de l\'admin',
      error: error.message
    });
  }
};

// Contrôleur pour obtenir tous les admins
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



// Contrôleur pour obtenir un admin par son ID
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

// Contrôleur pour mettre à jour un admin
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, password, superAdmin ,regionId } = req.body;

    // Vérifier si l'utilisateur essaie de modifier un autre admin
    if (req.user.id != id && !req.user.superAdmin) {
      return res.status(403).json({
        message: 'Vous n\'avez pas le droit de modifier cet admin'
      });
    }

    // Seul un superAdmin peut promouvoir un autre admin en superAdmin
    if (superAdmin && !req.user.superAdmin) {
      return res.status(403).json({
        message: 'Seul un superAdmin peut promouvoir un admin en superAdmin'
      });
    }

    const updatedAdmin = await adminService.updateAdmin(id, { nom, prenom, email, password, superAdmin , regionId});

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

// Contrôleur pour supprimer un admin
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'utilisateur essaie de se supprimer lui-même
    if (req.user.id == id) {
      return res.status(400).json({
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }
    
    // Vérifier si l'utilisateur a les droits pour supprimer un admin
    if (!req.user.superAdmin) {
      return res.status(403).json({
        message: 'Seul un superAdmin peut supprimer un admin'
      });
    }

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

const getAdminsCount = async (req, res) => {
  try {
    const countData = await adminService.getAdminsCount();
    res.status(200).json({ message: 'Nombre total de admins récupéré', data: countData });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du nombre total de admins', error: error.message });
  }
};
// Exporter tous les contrôleurs
module.exports = {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAdminsCount
};