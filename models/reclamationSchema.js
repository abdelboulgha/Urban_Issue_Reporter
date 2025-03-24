const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');
const Citoyen = require('./citoyenSchema');
const Categorie = require('./categorieSchema');
const Admin = require('./adminSchema');
const reclamationSchema = sequelize.define('Reclamation', {
  date_de_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Sets the default to current timestamp
    allowNull: false,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'en_cours', 'résolue', 'rejetée'),
    allowNull: false,
    defaultValue: 'en_attente', // Default status
  },
  nombre_de_votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  localisation: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false // Disable createdAt and updatedAt
});
reclamationSchema.belongsTo(Citoyen, { foreignKey: 'citoyenId' });
reclamationSchema.belongsTo(Categorie,{foreignKey:'categorieId'});
//reclamationSchema.belongsTo(Admin,{foreignKey:'adminId'});
// Sync the table
// sequelize.sync({ force: true })
//   .then(() => {
//     console.log("Reclamation table has been synchronized.");
//   })
//   .catch(err => {
//     console.error("Error syncing the Reclamation table:", err);
//   });

module.exports = { reclamationSchema };
