const express = require('express');
const router = express.Router(); 
const { Op } = require('sequelize'); 


router.get('/api/spots', async (req, res) => {
    const allSpots = await Spot.findAll(); 

    // if (!allSpots) {
    //     return res.status(404).json()
    // }
    return res.status(200).json(allSpots);
}); 

router.get('/api/spots/current', async (req, res) => {
    const currentUserId =

    const currentSpots = 

})











module.exports = router;