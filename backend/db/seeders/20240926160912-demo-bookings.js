'use strict';
const { Booking } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object 
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 3,
        startDate: "2024-11-19",
        endDate: "2024-11-20",
      },
      {
        spotId: 2,
        userId: 1,
        startDate: "2024-11-26",
        endDate: "2024-11-27",
      },
      {
        spotId: 3,
        userId: 2,
        startDate: "2024-10-18",
        endDate: "2024-10-19",
      },
      {
        spotId: 4,
        userId: 1,
        startDate: "2024-10-31",
        endDate: "2024-11-01",
      }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: [Booking.startDate] }
    }, {})
  }
};
