'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object 
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: '../assets',
      },
      {
        reviewId: 2,
        url: '../assets',
      },      
      {
        reviewId: 3,
        url: '../assets',
      },      
      {
        reviewId: 4,
        url: '../assets',
      },
      {
        reviewId: 4,
        url: '../assets',
      },
      {
        reviewId: 1,
        url: '../assets',
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ["../assets"] }
    }, {})
  }
};
