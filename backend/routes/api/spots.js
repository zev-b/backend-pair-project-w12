const express = require('express');
const router = express.Router(); 
const { Op, ValidationError } = require('sequelize'); 
const { restoreUser, requireAuth } = require('../../utils/auth.js'); 
const { Spot, SpotImage, Review, ReviewImage, User, Booking } = require('../../db/models');
const { route } = require('./bookings.js');



function calcReviews(reviews) {
    let count = 0;
    for (let i = 0; i < reviews.length; i++) {
        count++;
    }
    return count;
}
function calcAvg(reviews) {
    const rating = reviews.map(review => review.stars); //! Extract the stars from EACH review
    let totalRating = 0; 
    // Calculate the total sum of the rating
    for (let i = 0; i < rating.length; i++) {
       totalRating += rating[i];
    }

    //Calculate the average
    if (rating.length > 0) {
        return totalRating / rating.length;
    } else {
        return 0;
    }
};

// function getPreviewImg(images) {
//     if (images.length > 0) {
//         return images[0].url;       //^<============ convert to grab where preview is TRUE (See below func)
//     } else {
//         return null;
//     }
// }; 

function getPreviewImg(images) {
    const previewImage = images.find(image => image.preview === true);
    return previewImage ? previewImage.url : null;
}


router.get('/', async (req, res) => {
    const allSpots = await Spot.findAll({
        include: [
            {
                model: Review,
                as: 'Reviews',
            },
            {
                model: SpotImage,
                as: 'SpotImages'
            },
        ]
    }); 
    const spotDeets = allSpots.map ( spot => {
        const avgRating = calcAvg(spot.Reviews);

        const previewImg = getPreviewImg(spot.SpotImages);

        return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: avgRating,
            previewImage: previewImg
        };
    });

    return res.status(200).json({ Spots: spotDeets });
}); 


router.get('/current', restoreUser, requireAuth, async (req, res) => {
    const currentUserId = req.user.id;

    const currentSpots = await Spot.findAll({
        where: {
            ownerId: currentUserId,
        },
        include: [
            {
                model: Review,
                as: 'Reviews',
            },
            {
                model: SpotImage,
                as: 'SpotImages',
            },
        ]
    });

    const spotDeets = currentSpots.map ( spot => {
        const avgRating = calcAvg(spot.Reviews);
        
        const previewImg = getPreviewImg(spot.SpotImages);

        return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: avgRating,
            previewImage: previewImg
        };
    });

    return res.status(200).json({ Spots: spotDeets });

}); 

router.get('/:spotId', async (req, res) => {
    
     const spotById = await Spot.findOne({
        where: {
            id: req.params.spotId,
        },
        include: [
            {
                model: Review,
                as: 'Reviews',
            },
            {
                model: SpotImage,
                as: 'SpotImages',
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: User,
            
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });

    if (!spotById) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    } 
    // console.log(spotById, `<===============`);
        const avgRating = calcAvg(spotById.Reviews);
        const numReviews = calcReviews(spotById.Reviews);
        const previewImg = getPreviewImg(spotById.SpotImages);

        const spotDeets = {
            id: spotById.id,
            ownerId: spotById.ownerId,
            address: spotById.address,
            city: spotById.city,
            state: spotById.state,
            country: spotById.country,
            lat: spotById.lat,
            lng: spotById.lng,
            name: spotById.name,
            description: spotById.description,
            price: spotById.price,
            createdAt: spotById.createdAt,
            updatedAt: spotById.updatedAt,
            numReviews: numReviews,
            avgStarRating: avgRating,
            SpotImages: spotById.SpotImages,
            Owner: {
                id: spotById.User.id,
                firstName: spotById.User.firstName,
                lastName: spotById.User.lastName,
            }
        };

    return res.status(200).json(spotDeets);

});

router.post('/', restoreUser, requireAuth, async (req, res) => {
    // try {
        console.log('Received Cookies:', req.cookies);

        const { address, city, state, country, lat, lng, name, description, price } = req.body; 

        const validationErrors = {}; // or []

        // if (!address) validationErrors.push('Street address is required');
        // if (!city) validationErrors.push('City is required');
        // if (!state) validationErrors..push('State is required');
        // if (!country) validationErrors.push('Country is required');
        // if (!lat || lat > 90 || lat < -90) validationErrors.push('Latitude must be within -90 and 90');
        // if (!lng || lng > 180 || lng < -180) validationErrors.push('Longitude must be within -180 and 180');
        // if (!name || name.length > 50) validationErrors.push('Name must be less than 50 characters');
        // if (!description) validationErrors.push('Description is required');
        // if (!price || price < 1) validationErrors.push('Price per day must be a positive number');

        if (!address) validationErrors.address = 'Street address is required';
        if (!city) validationErrors.city = 'City is required';
        if (!state) validationErrors.state = 'State is required';
        if (!country) validationErrors.country = 'Country is required';
        if (!lat || lat > 90 || lat < -90) validationErrors.lat = 'Latitude must be within -90 and 90';
        if (!lng || lng > 180 || lng < -180) validationErrors.lng = 'Longitude must be within -180 and 180';
        if (!name || name.length > 50) validationErrors.name = 'Name must be less than 50 characters';
        if (!description) validationErrors.description = 'Description is required';
        if (!price || price < 1) validationErrors.price = 'Price per day must be a positive number';

        // if (validationErrors.length) {
        //     // throw new ValidationError('Validation error', validationErrors);
        //     return res.status(400).json({ message: 'Validation error', errors: validationErrors });
        // }

        if (Object.keys(validationErrors).length) {
            const message = 'Bad Request'; 
            return res.status(400).json({ message, errors: validationErrors });
        }

        const newSpot = await Spot.create({
            ownerId: req.user.id,
            address, 
            city, 
            state, 
            country,
            lat, 
            lng, 
            name, 
            description, 
            price,
    }); 

    res.status(201).json(newSpot); 
    // } catch (e) {
    //     if (e instanceof ValidationError) {
    //         return res.status(400).json({message: 'Validation error', errors: e.errors});
    //     } else {
    //         return res.status(500).json({message: 'Server error'});
    //     }
    // } 
})   

router.post('/:spotId/images', restoreUser, requireAuth, async (req, res) => { 
    const { url, preview, spotId } = req.body;

    const spotById = await Spot.findByPk(req.params.spotId); 
    
    if (!spotById) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    } 

    if (spotById.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Spot must belong to user"
        })
    }

    const newImage = await SpotImage.create({
        url: req.body.url,
        preview: req.body.preview,
        spotId: spotById.id,
    }); 

    const returnInfo = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview,
    }
    
    res.status(201).json(returnInfo);
})

router.put('/:spotId', restoreUser, requireAuth, async (req, res) => {
    // try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body; 
        
        const validationErrors = {}; 

        // if (!address) validationErrors.push('Street address is required');
        // if (!city) validationErrors.push('City is required');
        // if (!state) validationErrors.push('State is required');
        // if (!country) validationErrors.push('Country is required');
        // if (!lat || lat > 90 || lat < -90) validationErrors.push('Latitude must be within -90 and 90');
        // if (!lng || lng > 180 || lng < -180) validationErrors.push('Longitude must be within -180 and 180');
        // if (!name || name.length > 50) validationErrors.push('Name must be less than 50 characters');
        // if (!description) validationErrors.push('Description is required');
        // if (!price || price < 1) validationErrors.push('Price per day must be a positive number'); 

        if (!address) validationErrors.address = 'Street address is required';
        if (!city) validationErrors.city = 'City is required';
        if (!state) validationErrors.state = 'State is required';
        if (!country) validationErrors.country = 'Country is required';
        if (!lat || lat > 90 || lat < -90) validationErrors.lat = 'Latitude must be within -90 and 90';
        if (!lng || lng > 180 || lng < -180) validationErrors.lng = 'Longitude must be within -180 and 180';
        if (!name || name.length > 50) validationErrors.name = 'Name must be less than 50 characters';
        if (!description) validationErrors.description = 'Description is required';
        if (!price || price < 1) validationErrors.price = 'Price per day must be a positive number';

        // if (validationErrors.length) {
        //     throw new ValidationError('Validation error', validationErrors);
        // }

        if (Object.keys(validationErrors).length) {
            const message = 'Bad request'; 
            return res.status(400).json({ message, errors: validationErrors });
        }

        let spotById = await Spot.findByPk(req.params.spotId); 
        
        if (!spotById) {
            return res.status(404).json({ message: "Spot couldn't be found" })
        } 
    
        if (spotById.ownerId !== req.user.id) {
            return res.status(403).json({
                message: "Spot must belong to user"
            })
        }

        spotById = await spotById.update({
        address: req.body.address,
        city: req.body.city, 
        state: req.body.state, 
        country: req.body.country, 
        lat: req.body.lat, 
        lng: req.body.lng, 
        name: req.body.name, 
        description: req.body.description, 
        price: req.body.price, 
    }); 

    res.status(200).json(spotById); 
    // } catch (e) {
    //     if (e instanceof ValidationError) {
    //         return res.status(400).json({ message: 'Validation error', errors: e.errors });
    //     } else {
    //         return res.status(500).json({ message: 'Server error' });
    //     }
    // } 
    
}) 

router.delete('/:spotId', restoreUser, requireAuth, async (req, res) => { 
    const spotById = await Spot.findByPk(req.params.spotId);

    if (!spotById) {
        return res.status(404).json({ message: "Spot couldn't be found" })
    }
    
    if (spotById.ownerId !== req.user.id) {
        return res.status(403).json({
            message: "Spot must belong to user"
        })
    } 

    await spotById.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
})
 

router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
  
    try {
      const reviews = await Review.findAll({
        where: {
          spotId,
        },
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName'],
          },
          {
            model: ReviewImage,
            as: 'ReviewImages',
            attributes: ['id', 'url'],
          },
        ],
      });
  
      if (!reviews.length) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
  
      const reviewsWithImages = reviews.map((review) => {
        const jsonReview = review.toJSON();
        return jsonReview;
      });
  
      res.status(200).json({ Reviews: reviewsWithImages }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/:spotId/reviews', restoreUser, requireAuth, async (req, res) => {
    // try {
        const { review, stars } = req.body;
        const { spotId } = req.params;

        const validationErrors = {};

        if (!review) {
            validationErrors.review = 'Review text is required';
        }
        if (!stars || isNaN(stars) || stars < 1 || stars > 5) {
            validationErrors.stars = 'Stars must be an integer from 1 to 5';
        }

        // if (validationErrors.length) {
        //     throw new ValidationError('Validation error', validationErrors);
        // } 

        if (Object.keys(validationErrors).length) {
            const message = 'Bad Request'; 
            return res.status(400).json({ message, errors: validationErrors });
        }

        const spotExists = await Spot.findByPk(spotId);

        if (!spotExists) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const priorReview = await Review.findOne({
            where: {
                spotId,
                userId: req.user.id,
            },
        }); 

        if (priorReview) {
            return res.status(500).json({
                message: 'User already has a review for this spot',
            })
        } 

        const newReview = await Review.create({
            userId: req.user.id,
            spotId,
            review,
            stars,
        });

        res.status(201).json(newReview);
    // } catch (e) {
    //     if (e instanceof ValidationError) {
    //         return res.status(400).json({ message: 'Validation error', errors: e.errors });
    //     } else {
    //         return res.status(500).json({ message: 'Server error' });
    //     }
    // }

});
router.get('/:spotId/bookings', restoreUser, requireAuth, async (req,res) => {
    const { spotId } = req.params;
    const { userId } = req.user.id
    const spotExists = await Spot.findByPk(spotId);

    if (spotId === userId)

    if (!spotExists) {
        return res.status(404).json({message: "Spot couldn't be found"})
    };
    const booking = await Booking.findAll({
        where: { spotId },
        include: userId === spotExists.ownerId ? [{moserl :User, attributes: ['id', 'firstName', 'lastName']}] : []
    });
    if (userId === spotExists.ownerId) {
        return res.status(200).json({Bookings: booking});
    } else { 
        const filteredBookings = booking.map(booking => ({
            spotId: booking.spotId,
            startDate: booking.startDate,
            endDate: booking.endDate
        }));
        return res.status(200).json({Bookings: filteredBookings })
    }
} )
module.exports = router;