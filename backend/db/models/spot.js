'use strict'; 


const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, 
    address: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false, 
    }, 
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL,
      unique: true,
      allowNull: false, 
      validate: {
        min: -90, 
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      unique: true,
      allowNull: false, 
      validate: {
        min: -180, 
        max: 180,
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
          max: 50,
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false, 
      validate: {
        min: 1
      }
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};