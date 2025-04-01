const {DataTypes } = require('sequelize');
const {sequelize} = require('../database/db')
const Region = require('./regionSchema');
const adminSchema = sequelize.define('admin', {
    // Define fields (columns)
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      //unique: true,
      validate: {
        isEmail: true, // Validate email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100], // Password must be at least 6 characters long
      },
    },
    superAdmin: {
      type:DataTypes.BOOLEAN,
      defaultValue: false, // Default value as current date and time
    },
  }, {
    timestamps: false, // Disable createdAt and updatedAt columns
  });
  adminSchema.belongsTo(Region,{foreignKey:'regionId'});
  
  // sequelize.sync({ force: false, alter: true })
  //   .then(() => {
  //     console.log("User table has been synchronized (created/altered if needed).");
  //   })
  //   .catch(err => {
  //     console.error("Error syncing the User table:", err);
  //   });

    module.exports = adminSchema ;
  