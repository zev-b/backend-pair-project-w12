'use strict';
const {
  Model, Validator
} = require('sequelize'); 

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {

    static associate(models) {
      SpotImage.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
  });
    }
  }
  SpotImage.init({
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
        model: 'Spots',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   isLocalOrUrl(value) {
      //     const localRegexTest = /^\.\/|\.\.\/|\/[^\/]*$/; 

      //     if (localRegexTest.test(value)) {
      //       return;
      //     } 

      //     throw new Error('URL must be a local path or valid URL.')
      //   }
      // },
    },
    preview: DataTypes.BOOLEAN,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};