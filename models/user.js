module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      photo_url: DataTypes.STRING,
      tokens: DataTypes.JSON,
      spotify_id: DataTypes.INTEGER.UNSIGNED,
    },
    {},
  );

  return User;
};
