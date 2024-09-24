'use strict';

const { ReviewImage } = require('../models/reviewimage');

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
        url: gfg
      },
      {
        reviewId: 2,
        url: gfg
      },      
      {
        reviewId: 3,
        url: gfg
      },      
      {
        reviewId: 4,
        url: gfg
      },
      {
        reviewId: 4,
        url: gfg
      },
      {
        reviewId: 1,
        url: gfg
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
