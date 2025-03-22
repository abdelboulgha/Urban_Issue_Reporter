require('dotenv').config();
const mysql = require('mysql2');

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST, 
  dialect: 'mysql',
});

const connectionToMySql = () => {
sequelize.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});
};


module.exports = { connectionToMySql,sequelize};
