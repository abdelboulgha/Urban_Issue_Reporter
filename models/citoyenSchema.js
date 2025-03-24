const {  DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');  // Importez votre instance Sequelize


// Définir le schéma du modèle Citoyen
const citoyenSchema = sequelize.define('Citoyen', {
  // Définir les champs (colonnes)
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cin: {
    type: DataTypes.STRING,
    allowNull: false,
    //unique: true, // CIN doit être unique
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    //unique: true, // L'email doit être unique
    validate: {
      isEmail: true, // Valider le format de l'email
    },
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100], // Le mot de passe doit avoir entre 6 et 100 caractères
    },
  },
}, {
  timestamps: false, // Désactiver les colonnes createdAt et updatedAt
});



// Synchroniser le modèle avec la base de données
sequelize.sync({ force: false, alter: true })
  .then(() => {
    console.log("Table 'Citoyen' a été synchronisée (créée/modifiée si nécessaire).");
  })
  .catch(err => {
    console.error("Erreur lors de la synchronisation de la table 'Citoyen' :", err);
  });

module.exports = citoyenSchema ;
