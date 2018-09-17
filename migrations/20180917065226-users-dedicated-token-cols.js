module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'tokens');

    queryInterface.addColumn('Users', 'token_expires', {
      type: Sequelize.INTEGER.UNSIGNED,
    });
    queryInterface.addColumn('Users', 'access_token', {
      type: Sequelize.STRING,
    });
    queryInterface.addColumn('Users', 'refresh_token', {
      type: Sequelize.STRING,
    });
  },

  down: () => {},
};
