const { Sequelize, sequelize } = require('../config/sequelize');

const Artist = sequelize.define('artists', {
  name: Sequelize.STRING,
  albums: Sequelize.INTEGER,
});

module.exports = Artist;
