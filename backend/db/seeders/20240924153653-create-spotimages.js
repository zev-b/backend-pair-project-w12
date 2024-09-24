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
        spotid: 1,
        url: '../assets/wing-chair.png',
        preview: true,
      }, 
      {
        spotid: 1,
        url: '../assets/wing-chair2.png',
        preview: false,
      }, 
      {
        spotid: 2,
        url: '../assets/bleachers.png',
        preview: true,
      }, 
      {
        spotid: 3,
        url: '../assets/haunted-bench.png',
        preview: true,
      }, 
      {
        spotid: 4, 
        url: '../assets/pew-pew.png',
        preview: true,
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
