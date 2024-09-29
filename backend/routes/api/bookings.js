const express = require('express');
const router = express.Router(); 
const { Op, ValidationError  } = require('sequelize'); 
const { restoreUser, requireAuth } = require('../../utils/auth.js'); 
const { Spot, SpotImage, Review, ReviewImage, User, Booking } = require('../../db/models');

function getPreviewImg(images) {
    if (images.length > 0) {
        return images[0].url;
    } else {
        return null;
    }
};

router.get('/current', requireAuth, async (req, res) => {
    const curUser = req.user.id;
    const curBookings = await Booking.findAll({
        where: {
            userId: curUser
        },
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],            
            },
            {
                model: SpotImage,
                as: 'SpotImages',
                where: {
                    preview: true,
                },
                attributes: ['url'],
                // as: 'previewImage',
            },
 
        ],
    });
    const bookingDeets = curBookings.map ( booking => {
        const spot = booking.Spot;
        const previewImage = getPreviewImg(spot.SpotImages);
        return {
            ...booking.toJSON(),
            Spot: {
                ...spot.toJSON(),
                previewImage
            }
        };
    });
    return res.status(200).json({ Bookings: bookingDeets});
})

module.exports = router;