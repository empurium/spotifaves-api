module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      photo_url: DataTypes.STRING,
      spotify_id: DataTypes.INTEGER.UNSIGNED,
      token_expires: DataTypes.INTEGER.UNSIGNED,
      access_token: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
    },
    {},
  );

  return User;
};
