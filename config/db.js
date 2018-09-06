const dotenv = require('dotenv');

dotenv.load();

module.exports = {
  development: {
    host: process.env.SQL_HOSTNAME,
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    operatorsAliases: false, // security
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: console.log,
    dialect: 'mysql',
  },
  // CircleCI or similar...
  test: {
    host: '127.0.0.1',
    username: 'database_test',
    password: null,
    database: 'database_test',
    operatorsAliases: false, // security
    dialect: 'mysql',
  },
  production: {
    host: process.env.SQL_HOSTNAME,
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    operatorsAliases: false, // security
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialect: 'mysql',
  },
};
