'use strict'; 

const { Spot } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Sesame Street",
        city: "Lakeview",
        state: "Oregan",
        country: "USA", 
        lat: 37.7749,
        lng: -122.4194,
        name: "Bench Press",
        description: "Solid oak wood with a resin finish, 1 bed",
        price: 12.50,
      },
      {
        ownerId: 1,
        address: "456 Seven Street",
        city: "Toelle",
        state: "Washington", 
        country: "USA", 
        lat: 25.7617, 
        lng: -80.1817, 
        name: "Wing Chair", 
        description: "Its got wings with arm-rests",
        price: 5.00,
      },
      {
        ownerId: 2,
        address: "789 Baseball Field Lane",
        city: "Boston",
        state: "Massachusetts", 
        country: "USA", 
        lat: 42.361145, 
        lng: -71.057083, 
        name: "The Bleachers", 
        description: "Great for parties !", 
        price: 35.50,
      },
      {
        ownerId: 3,
        address: "2135 Street Corner",
        city: "Miami",
        state: "Florida", 
        country: "USA", 
        lat: 25.7617, 
        lng: 80.1918, 
        name: "The Haunted Bench", 
        description: "Known to far and wide that ghosts have made it their home", 
        price: 60.00,
      },
      {
        ownerId: 4,
        address: "73152 Woodward Avenue",
        city: "Detroit",
        state: "Michigan", 
        country: "USA", 
        lat: 42.3314, 
        lng: 83.0469, 
        name: "Pew Pew", 
        description: "Spacious, questionable neighborhood", 
        price: 7.00,
      },
      {
        ownerId: 5,
        address: "31 Caribbean Sea",
        city: "Barbados",
        state: "Barbados",
        country: "Barbados", 
        lat: 13.1677,
        lng: -59.6171,
        name: "Floating Oasis",
        description: "Saturated bamboo and polinated Lilies, towels provided",
        price: 199.50,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    
     return await queryInterface.bulkDelete('Spots', null, {});
  }
};
