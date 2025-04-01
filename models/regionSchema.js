const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const regionSchema = sequelize.define(
  "region",
  {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Disable createdAt and updatedAt
  }
);

// Sync the table
// sequelize.sync({ alter: true })
//   .then(() => {
//     console.log("region table has been synchronized.");
//   })
//   .catch(err => {
//     console.error("Error syncing the region table:", err);
//   });

module.exports = regionSchema;
