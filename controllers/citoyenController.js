const citoyenService = require('../services/citoyenService');

// Controller to handle the creation of a citoyen
const createCitoyen = async (req, res) => {
  try {
    const { nom, prenom, adresse, cin, email, telephone, password } = req.body;

    // Call the service to create the citoyen
    const newCitoyen = await citoyenService.createCitoyen({ nom, prenom, adresse, cin, email, telephone, password });

    // Respond with the newly created citoyen
    res.status(201).json({
      message: 'Citoyen created successfully',
      citoyen: newCitoyen
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating citoyen',
      error: error.message
    });
  }
};

module.exports = { createCitoyen };
