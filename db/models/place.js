"use strict";

module.exports = (sequelize, DataTypes) => {
  const Place = sequelize.define(
    "Place",
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      fullAddress: {
        allowNull: false,
        type: DataTypes.STRING
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING
      },
      location: {
        allowNull: false,
        type: DataTypes.POINT
      },
      stars: {
        allowNull: true,
        type: DataTypes.REAL
      },
      reviewCount: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      open: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      photoURL: {
        allowNull: true,
        type: DataTypes.STRING
      }
    },
    {
      paranoid: true
    }
  );

  Place.associate = function(models) {
    models.Place.hasMany(models.Review, { as: "reviews" });
    models.Place.belongsTo(models.User, {
      as: "reviewer",
      foreignKey: "reviewerId"
    });
  };

  return Place;
};
