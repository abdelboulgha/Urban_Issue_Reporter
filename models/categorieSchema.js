const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const categorieSchema = sequelize.define('Categorie', {
  libelle: {
    type: DataTypes.STRING,
    allowNull: false,
    //unique: true // Assuming each category should have a unique label
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false // Disable createdAt and updatedAt
});

// Sync the table
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Categorie table has been synchronized.");
  })
  .catch(err => {
    console.error("Error syncing the Categorie table:", err);
  });

module.exports = categorieSchema ;
