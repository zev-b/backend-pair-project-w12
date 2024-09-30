'use strict'; 

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object 
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: '../assets/wing-chair.png',
        preview: true,
      }, 
      {
        spotId: 1,
        url: '../assets/wing-chair2.png',
        preview: false,
      }, 
      {
        spotId: 2,
        url: '../assets/bleachers.png',
        preview: true,
      }, 
      {
        spotId: 3,
        url: '../assets/haunted-bench.png',
        preview: true,
      }, 
      {
        spotId: 4, 
        url: '../assets/pew-pew.png',
        preview: true,
      }, 
    ])
  },
  // ,  { validate: true }
  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['../assets/wing-chair.png', '../assets/wing-chair2.png', '../assets/bleachers.png', '../assets/haunted-bench.png', '../assets/pew-pew.png'] }
    }, {})
  }
};
