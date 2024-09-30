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
            // {
            //     model: SpotImage,
            //     as: 'SpotImages',
            //     where: {
            //         preview: true,
            //     },
            //     attributes: ['url'],
            //     // as: 'previewImage',
            // },
 
        ],
    });

    // const bookingDeets = curBookings.map ( booking => {
    //     const spot = booking.Spot;
    //     const previewImage = getPreviewImg(spot.SpotImages);
    //     return {
    //         ...booking.toJSON(),
    //         Spot: {
    //             ...spot.toJSON(),
    //             previewImage
    //         }
    //     };
    // });
    // return res.status(200).json({ Bookings: bookingDeets});

    const bookingDeets = await Promise.all(
        curBookings.map(async (booking) => {
          const spot = booking.Spot;
        //   const previewImage = await getPreviewImg(spot.id);
        const spotImages = await SpotImage.findAll({
            where: {
              spotId: spot.id,
            },
          });
          const previewImage = getPreviewImg(spotImages);

          return {
            ...booking.toJSON(),
            Spot: {
              ...spot.toJSON(),
              previewImage,
            },
          };
        })
    );
    return res.status(200).json({ Bookings: bookingDeets });
});
 


// ! INSERT OTHER BOOKINGS ENDPOINTS HERE


// * NEEDS FIXING, NOT LETTING USR 1 DEL HIS SECOND BOOKING?
router.delete('/:bookingId', restoreUser, requireAuth, async (req, res) => { 
    const { bookingId } = req.params;
    const currUserId = req.user.id; 

    const booking = await Booking.findOne({
        where: {
          id: bookingId
        },
        include: [{
          model: Spot,
          attributes: ['ownerId'],
        }]
      });

    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" })
    }
    console.log(`\n====Booking====\n`, booking)
    if ((booking.userId !== currUserId || booking.Spot.ownerId !== currUserId)) {
        return res.status(403).json({ message: "Booking must belong to the current user or the Spot must belong to the current user" })
    } 

    const startOfBooking = new Date(booking.startDate);
    const todaysDate = new Date();

    if (startOfBooking <= todaysDate) {
        return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
    }

    await booking.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
})

module.exports = router;