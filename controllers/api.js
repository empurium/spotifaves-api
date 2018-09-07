const models = require('../models');

/**
 * Hello from the API.
 */
exports.getIndex = (req, res) => {
  res.status(200).json({
    message: "Hello friend! I'm an API! 🤖",
  });
};

/**
 * Quick test of Sequelize config.
 */
exports.getArtists = (req, res) => {
  models.Artist.findAll({}).then((artists) => {
    res.status(200).json({
      data: artists,
    });
  });
};
