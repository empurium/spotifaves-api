module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.renameColumn('Users', 'spotify', 'spotify_id');
  },

  down: (queryInterface, Sequelize) => {},
};
