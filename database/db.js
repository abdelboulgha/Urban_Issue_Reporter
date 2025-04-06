require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Needed for Supabase SSL
    },
  },
});

const connectionToPostgres = () => {
  sequelize.authenticate()
    .then(() => {
      console.log('Connected to Supabase PostgreSQL successfully!');
    })
    .catch((err) => {
      console.error('Unable to connect to Supabase PostgreSQL:', err);
    });
};

module.exports = { connectionToPostgres, sequelize };
