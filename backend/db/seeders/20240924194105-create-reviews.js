'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object 
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: "Spacious yard really feel one with nature.",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 3,
        review: "THE PARTY PLACE!",
        stars: 5,
      },
      {
        spotId: 3,
        userId: 1,
        review: "Great experience but, Something kept touching my feet.",
        stars: 3,
      },
      {
        spotId: 4,
        userId: 2,
        review: "Beautiful art, only heard one pew though.",
        stars: 2,
      },
      {
        spotId: 4,
        userId: 1,
        review: "Felt right at home, very cozy.",
        stars: 4,
      },

    ], { validate: true })





  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ["Spacious yard really feel one with nature.", "THE PARTY PLACE!", "Great experience but, Something kept touching my feet.", "Beautiful art, only heard one pew though."] }
    }, {})
  }
};
