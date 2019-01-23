"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        allowNull: false,
        type: DataTypes.STRING
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING
      },
      surname: {
        allowNull: true,
        type: DataTypes.STRING
      },
      reviewCount: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      likes: {
        allowNull: true,
        type: DataTypes.INTEGER
      }
    },
    {
      paranoid: true
    }
  );

  User.associate = function(models) {
    models.User.hasMany(models.Review, {
      foreignKey: "reviewerId",
      as: "reviews"
    });
    models.User.hasMany(models.Review, {
      foreignKey: "reviewerId",
      as: "places"
    });
    models.User.belongsToMany(models.Review, {
        through: "PlaceReviews",
        as: "upvotedReviews"
    })

  };

  return User;
};
