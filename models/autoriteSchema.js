const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const autoriteSchema = sequelize.define('Autorite', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  timestamps: false // Disable createdAt and updatedAt
});

// Sync the table
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Autorite table has been synchronized.");
  })
  .catch(err => {
    console.error("Error syncing the Autorite table:", err);
  });

module.exports = { autoriteSchema };
