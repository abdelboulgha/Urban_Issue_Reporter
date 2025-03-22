const adminService = require('../services/adminService');

// Controller to handle the creation of a citoyen
const createAdmin = async (req, res) => {
  try {
    const { nom, prenom,email,password,superAdmin } = req.body;

    // Call the service to create the citoyen
    const newAdmin = await adminService.createAdmin({ nom, prenom,email,password,superAdmin });

    // Respond with the newly created citoyen
    res.status(201).json({
      message: 'Admin created successfully',
      admin: newAdmin
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating admin',
      error: error.message
    });
  }
};

module.exports = { createAdmin };
