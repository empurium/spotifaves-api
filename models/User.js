module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      password_reset_token: DataTypes.STRING,
      password_reset_expires: DataTypes.STRING,
      photo_url: DataTypes.STRING,
      tokens: DataTypes.JSON,
      spotify_id: DataTypes.INTEGER.UNSIGNED,
    },
    {},
  );

  return User;
};
