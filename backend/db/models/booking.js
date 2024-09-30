'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true,
      allowNull:false
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: "Spots",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isValid(value) {
          if (value < new Date()) {
            throw new Error("Can not be before Today's Date")
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
      isValid(value) {
        if (value < this.startDate) {
          throw new Error("Can not be before Start Date")
        }
      }
    }
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};