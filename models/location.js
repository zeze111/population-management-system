"use strict";
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define("Location", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    males: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    females: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parentLocation: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Earth"
    }
  });
  Location.associate = function(models) {
    Location.hasMany(models.Location, {
      foreignKey: "parentLocationId",
      onDelete: "CASCADE"
    });
  };
  return Location;
};
