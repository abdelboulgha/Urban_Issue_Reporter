const citoyenSchema  = require('../models/citoyenSchema');  // Adjust path if necessary

// Service to handle creating a citoyen
const createCitoyen = async ({ nom, prenom, adresse, cin, email, telephone, password }) => {
  try {
    // Create a new citoyen in the database
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

module.exports = { createCitoyen };
