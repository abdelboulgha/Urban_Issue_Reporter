const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');
const { reclamationSchema } = require('./reclamationSchema');

const photoSchema = sequelize.define('Photo', {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true // Ensures the string is a valid URL
    }
  }
}, {
  timestamps: false // Disable createdAt and updatedAt
});
photoSchema.belongsTo(reclamationSchema,{foreignKey:'reclamationId'})

// Sync the table
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Photo table has been synchronized.");
  })
  .catch(err => {
    console.error("Error syncing the Photo table:", err);
  });

module.exports = { photoSchema };
