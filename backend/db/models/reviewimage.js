'use strict';
const {
  Model, Validator
} = require('sequelize'); 

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review, {
        foreignKey: "reviewId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
  }
  ReviewImage.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Reviews",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      // validate: {
      //   isLocalOrUrl(value) {
      //     const localRegexTest = /^\.\/|\.\.\/|\/[^\/]*$/; 

      //     const urlRegexTest = /^(\/\w+\/\w+\/\w+|(?:[a-zA-Z]{1,10}:\/\/)?(?:www\.)?(?:[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})+(?:\/[^\s]*)?(\.(?:jpg|jpeg|png|webp|avif|gif|svg|bmp|ico|tiff))?)$/;

      //     // if (localRegexTest.test(value)) {
      //     //   return;
      //     // } 
      //     // if (Validator.isUrl(value)) {
      //     //   return;
      //     // }  
      //     // console.log(value, `<=== value`);
           

      //     if (urlRegexTest.test(value)) {
      //       throw new Error('URL must be a local path or valid URL.');
      //     } else {
      //       return;
      //     }

      //     // throw new Error('URL must be a local path or valid URL.');
      //   }
      // }
    },
  }, {
    sequelize,
    modelName: 'ReviewImage',
  });
  return ReviewImage;
};