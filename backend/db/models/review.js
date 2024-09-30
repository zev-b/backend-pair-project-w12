'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
  }
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Spots",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    review:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    stars:{
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      },
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};