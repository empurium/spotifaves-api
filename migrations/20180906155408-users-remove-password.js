module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'password');
    queryInterface.removeColumn('Users', 'password_reset_token');
    queryInterface.removeColumn('Users', 'password_reset_expires');
  },

  down: (queryInterface, Sequelize) => {},
};
