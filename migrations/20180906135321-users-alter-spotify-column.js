module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn('Users', 'spotify', {
      type: Sequelize.INTEGER.UNSIGNED,
    });
  },

  down: (queryInterface, Sequelize) => {},
};
