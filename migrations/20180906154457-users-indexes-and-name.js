module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'first_name');
    queryInterface.renameColumn('Users', 'last_name', 'name');
    queryInterface.addIndex('Users', {
      fields: ['email'],
      unique: true,
    });
    queryInterface.addIndex('Users', {
      fields: ['spotify_id'],
      unique: true,
    });
  },

  down: (queryInterface, Sequelize) => {},
};
