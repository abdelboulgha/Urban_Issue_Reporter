const adminSchema = require('../models/adminSchema');

// Service to get all admins
const getAdmins = async () => {
  try {
    const admins = await adminSchema.findAll();
    return admins;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des admins : ' + error.message);
  }
};

// Service to get a single admin by ID
const getAdminById = async (id) => {
  try {
    const admin = await adminSchema.findByPk(id);

    if (!admin) {
      throw new Error('Admin non trouvé');
    }

    return admin;
  } catch (error) {
    throw new Error('Erreur lors de la récupération de l\'admin : ' + error.message);
  }
};

// Service to handle creating an admin
const createAdmin = async ({ nom, prenom, email, password, superAdmin }) => {
  try {
    const admin = await adminSchema.create({
      nom,
      prenom,
      email,
      password,
      superAdmin,
    });

    return admin;
  } catch (error) {
    throw new Error('Erreur lors de la création de l\'admin : ' + error.message);
  }
};

// Service to update an admin by ID
const updateAdmin = async (id, { nom, prenom, email, password, superAdmin }) => {
  try {
    const admin = await adminSchema.findByPk(id);

    if (!admin) {
      throw new Error('Admin non trouvé');
    }

    // Update fields
    admin.nom = nom || admin.nom;
    admin.prenom = prenom || admin.prenom;
    admin.email = email || admin.email;
    admin.password = password || admin.password;
    admin.superAdmin = superAdmin !== undefined ? superAdmin : admin.superAdmin;

    // Save changes
    await admin.save();

    return admin;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de l\'admin : ' + error.message);
  }
};

// Service to delete an admin by ID
const deleteAdmin = async (id) => {
  try {
    const admin = await adminSchema.findByPk(id);

    if (!admin) {
      throw new Error('Admin non trouvé');
    }

    // Delete admin
    await admin.destroy();

    return { message: 'Admin supprimé avec succès' };
  } catch (error) {
    throw new Error('Erreur lors de la suppression de l\'admin : ' + error.message);
  }
};

module.exports = { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin };