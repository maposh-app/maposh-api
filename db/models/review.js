"use strict";

module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      stars: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      text: {
        allowNull: true,
        type: DataTypes.STRING
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

  Review.associate = function(models) {
    models.Review.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: "reviewerId"
    });
    models.Review.belongsTo(models.Place, {
      onDelete: "CASCADE"
    });
    models.Review.belongsToMany(models.User, {
      through: "PlaceReviews",
      as: "upvoters"
    });
  };

  return Review;
};
