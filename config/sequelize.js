const Sequelize = require('sequelize');

const env = { ...process.env };
const db = {};

const sequelize = new Sequelize(env.SQL_DATABASE, env.SQL_USERNAME, env.SQL_PASSWORD, {
  host: env.SQL_HOSTNAME,
  dialect: 'mysql',
  logging: console.log,

  operatorsAliases: false, // security

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

db.Sequelize = Sequelize; // Sequelize methods, types, etc
db.sequelize = sequelize; // DB connection

module.exports = db;

/**
 * Handy connection test.
 *
// const dotenv = require('dotenv');
// dotenv.load(); // For testing connections
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
*/
