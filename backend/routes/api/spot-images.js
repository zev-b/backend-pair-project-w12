const express = require('express');
const router = express.Router(); 
const { Op, ValidationError } = require('sequelize'); 
const { restoreUser, requireAuth } = require('../../utils/auth.js'); 
const { Spot, SpotImage, Review, ReviewImage, User, Booking } = require('../../db/models');



router.delete('/:imageId', restoreUser, requireAuth, async (req, res) => {
    try {
        const spotImage = await SpotImage.findByPk(req.params.imageId, {
            include: {
              model: Spot,
              attributes: ['ownerId'],
            }
          });
  
      if (!spotImage) {
        return res.status(404).json({ message: "Spot Image couldn't be found" });
      }
  
      if (spotImage.Spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Spot must belong to user"
        })
      }
  
      await spotImage.destroy();
  
      res.status(200).json({ message: 'Successfully deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }); 



module.exports = router;