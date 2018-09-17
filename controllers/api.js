const models = require('../models');
const helloQueue = require('../queues/hello');

const apiController = {};

/**
 * Hello from the API.
 */
apiController.getIndex = (req, res) => {
  helloQueue.add({ message: 'Hello friend!' });

  res.status(200).json({
    message: "Hello friend! I'm an API! 🤖",
  });
};

/**
 * Quick test of Sequelize config.
 */
apiController.getArtists = (req, res) => {
  models.Artist.findAll({}).then((artists) => {
    res.status(200).json({
      data: artists,
    });
  });
};

module.exports = apiController;
