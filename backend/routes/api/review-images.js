const express = require('express');
const router = express.Router(); 
const { Op, ValidationError } = require('sequelize'); 
const { restoreUser, requireAuth } = require('../../utils/auth.js'); 
const { Spot, SpotImage, Review, ReviewImage, User, Booking } = require('../../db/models'); 

router.delete('/:imageId', restoreUser, requireAuth, async (req, res) => {
    try {
        const reviewImage = await ReviewImage.findByPk (req.params.imageId, {
            include: {
                model: Review,
                attributes: ['spotId', 'userId'],
            }
        });

        if (!reviewImage) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }

        if (reviewImage.Review.userId !== req.user.id) {
            return res.status(403).json({ message: "Review must belong to user" });
        }

        await reviewImage.destroy();

        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})








module.exports = router;