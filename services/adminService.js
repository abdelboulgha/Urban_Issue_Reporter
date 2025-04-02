// services/adminService.js
const adminSchema = require('../models/adminSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const regionSchema = require("../models/regionSchema");

// La clé secrète pour signer le token JWT
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète_très_sécurisée';

// Nombre de rounds pour le hachage bcrypt
const SALT_ROUNDS = 10;

// Service pour l'authentification d'un admin
const loginAdmin = async (email, password) => {
  try {
    // Trouver l'admin par son email
    const admin = await adminSchema.findOne({ where: { email } });
    
    if (!admin) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Créer l'objet payload pour le token JWT
    const payload = { 
      id: admin.id, 
      email: admin.email,
      nom: admin.nom,
      prenom: admin.prenom,
      superAdmin: admin.superAdmin
    };
    
    // Ajouter regionId au payload seulement s'il existe
    if (admin.regionId !== undefined) {
      payload.regionId = admin.regionId;
    }
    
    // Générer le token JWT
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '24h' } // Expiration du token après 24h
    );
    
    return {
      admin: {
        id: admin.id,
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        superAdmin: admin.superAdmin,
        regionId: admin.regionId // Inclure regionId s'il existe
      },
      token
    };
  } catch (error) {
    throw new Error('Erreur lors de la connexion: ' + error.message);
  }
};

// Service pour obtenir tous les admins
const getAdmins = async () => {
  try {
    const admins = await adminSchema.findAll({
      attributes: { exclude: ['password'] } // Exclure le mot de passe des résultats
    });
    return admins;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des admins: ' + error.message);
  }
};

// Service pour obtenir un admin par son ID
const getAdminById = async (id) => {
  try {
    const admin = await adminSchema.findByPk(id, {
      attributes: { exclude: ['password'] } // Exclure le mot de passe des résultats
    });

    if (!admin) {
      throw new Error('Admin non trouvé');
    }

    return admin;
  } catch (error) {
    throw new Error('Erreur lors de la récupération de l\'admin: ' + error.message);
  }
};

// Service pour créer un admin (inscription)
const createAdmin = async ({ nom, prenom, email, password, superAdmin,regionId }) => {
  try {
    // Vérifier si l'email existe déjà
    const existingAdmin = await adminSchema.findOne({ where: { email } });
    if (existingAdmin) {
      throw new Error('Cet email est déjà utilisé');
    }
    
    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Créer le nouvel admin avec le mot de passe haché
    const admin = await adminSchema.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      superAdmin: superAdmin || false,
      regionId,
    });

    // Générer un token JWT pour le nouvel admin
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email,
        nom: admin.nom,
        prenom: admin.prenom,
        superAdmin: admin.superAdmin,
        regionId: admin.regionId 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Retourner l'admin sans le mot de passe et avec le token
    return {
      admin: {
        id: admin.id,
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        superAdmin: admin.superAdmin,
        regionId: admin.regionId
      },
      token
    };
  } catch (error) {
    throw new Error('Erreur lors de la création de l\'admin: ' + error.message);
  }
};

// Service pour mettre à jour un admin
const updateAdmin = async (id, { nom, prenom, email, password, superAdmin,regionId }) => {
  try {
    const admin = await adminSchema.findByPk(id);

    if (!admin) {
      throw new Error('Admin non trouvé');
    }

    // Mettre à jour les champs
    if (nom) admin.nom = nom;
    if (prenom) admin.prenom = prenom;
    if (email) admin.email = email;
    if(regionId) admin.regionId = regionId;
    
    // Mettre à jour le mot de passe s'il est fourni
    if (password) {
      admin.password = await bcrypt.hash(password, SALT_ROUNDS);
    }
    
    if (superAdmin !== undefined) {
      admin.superAdmin = superAdmin;
    }

    // Sauvegarder les changements
    await admin.save();

    // Retourner l'admin sans le mot de passe
    return {
      id: admin.id,
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email,
      superAdmin: admin.superAdmin,
      regionId: admin.regionId
    };
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de l\'admin: ' + error.message);
  }
};

// Service pour supprimer un admin
const deleteAdmin = async (id) => {
  try {
    const admin = await adminSchema.findByPk(id);

    if (!admin) {
      throw new Error('Admin non trouvé');
    }

    // Supprimer l'admin
    await admin.destroy();

    return { message: 'Admin supprimé avec succès' };
  } catch (error) {
    throw new Error('Erreur lors de la suppression de l\'admin: ' + error.message);
  }
};

const getAdminsCount = async () => {
  try {
    const count = await adminSchema.count();
    return { totalAdmins: count };
  } catch (error) {
    throw new Error('Error fetching total admins count: ' + error.message);
  }
};

module.exports = { 
  getAdmins, 
  getAdminById, 
  createAdmin, 
  updateAdmin, 
  deleteAdmin,
  loginAdmin,
  getAdminsCount,
  JWT_SECRET  // Exporter la clé secrète pour la réutiliser dans le middleware d'authentification
};