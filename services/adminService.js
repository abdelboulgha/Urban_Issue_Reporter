const adminSchema = require('../models/adminSchema');

// Service to handle creating a citoyen
const createAdmin = async ({ nom, prenom,  email, password ,superAdmin}) => {
  try {
    // Create a new citoyen in the database
    const admin = await adminSchema.create({
      nom,
      prenom,
      email,
      password,
      superAdmin
    });

    return admin;
  } catch (error) {
    throw new Error('Error creating admin: ' + error.message);
  }
};

module.exports = { createAdmin };
