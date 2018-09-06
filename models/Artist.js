module.exports = (sequelize, DataTypes) => {
  const Artist = sequelize.define(
    'Artist',
    {
      name: DataTypes.STRING,
      albums: DataTypes.INTEGER,
    },
    {},
  );

  return Artist;
};
