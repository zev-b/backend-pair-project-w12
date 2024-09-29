const express = require('express');
const router = express.Router(); 
const { Op, ValidationError  } = require('sequelize'); 
const { restoreUser, requireAuth } = require('../../utils/auth.js'); 
const { Spot, SpotImage, Review, ReviewImage, User } = require('../../db/models');  


function getPreviewImg(images) {
    const previewImage = images.find(image => image.preview === true);
    return previewImage ? previewImage.url : null;
}


// router.get('/current', restoreUser, requireAuth, async (req, res) => {
//     const currentUserId = req.user.id; 

//     console.log(`Current User id ====>`, req.user.id);

//     const currentReviews = await Review.findAll({
//         where: {
//             userId: currentUserId,
//         },
//         include: [
//             {
//                 model: Spot,
//                 attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],            
//             },
//             {
//                 model: SpotImage,
//                 where: {
//                     preview: true,
//                 },
//                 attributes: ['url'],
//                 // as: 'previewImage',
//             },
//             {
//                 model: User,
//                 attributes: ['id', 'firstName', 'lastName'],
//             },
//             {
//                 model: ReviewImage,
//                 as: 'ReviewImages',
//                 attributes: ['id', 'url'],
//             }
//         ]
//     });

//     if (!currentReviews.length) {
//         return res.status(200).json({ message: 'No reviews found for user'});
//     }   

//     const reviewsDeets = currentReviews.map(review => { 
//         const previewImg = getPreviewImg(review.Spot.SpotImages);

//         return {
//             id: review.id,
//             userId: review.userId,
//             spotId: review.spotId,
//             review: review.review,
//             stars: review.stars,
//             createdAt: review.createdAt,
//             updatedAt: review.updatedAt,
//             User: review.User, 
//             Spot: {
//                 ...review.Spot,
//                 previewImage: previewImg,
//             },
//             ReviewImages: review.ReviewImages
//         }

//     });

//     // console.log(currentReviews, `<========`); 

//     res.status(200).json({ Reviews: reviewsDeets });
// }) 

// ^====================================

router.get('/current', restoreUser, requireAuth, async (req, res) => {
    const currentUserId = req.user.id; 

    const currentReviews = await Review.findAll({
        where: {
            userId: currentUserId,
        },
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],    
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
            },
            {
                model: ReviewImage,
                as: 'ReviewImages',
                attributes: ['id', 'url'],
            }
        ]
    }); 

    if (!currentReviews.length) {
        return res.status(200).json({ message: 'No reviews found for user'});
    }   

    const reviewsDeets = await Promise.all(currentReviews.map(async (review) => {
        const jsonReview = await review.toJSON();
        const spotId = jsonReview.Spot.id; 

        const previewImageObj = await SpotImage.findOne({ where: { spotId } });
        jsonReview.Spot.previewImage = previewImageObj?.url ?? null;
        
        
        return jsonReview;
    }));
    // console.log(reviewsDeets, `<========`); 

    res.status(200).json({ Reviews: reviewsDeets });
}); 

router.post('/:reviewId/images', restoreUser, requireAuth, async (req, res) => {
    const { url } = req.body;
    const { reviewId } = req.params;

    const grabReview = await Review.findByPk(reviewId);

    if (!grabReview) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    if (grabReview.userId !== req.user.id) {
        return res.status(403).json({ message: "Review must belong to user" });
    }

    const priorImages = await grabReview.getReviewImages();

    if (priorImages.length >= 10) {
        return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    }

    const newImage = await ReviewImage.create({
        reviewId,
        url,
    });

    const returnImage = {
        id: newImage.id,
        url: newImage.url,
    }

    res.status(201).json(returnImage);
});

router.put('/:reviewId', restoreUser, requireAuth, async (req, res) => { 
    // try {
        const { reviewId } = req.params;
        const { review, stars } = req.body;

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

        const reviewToUpdate = await Review.findByPk(reviewId);

        if (!reviewToUpdate) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (reviewToUpdate.userId !== req.user.id) {
            return res.status(403).json({ message: "Review must belong to user" })
        }

        reviewToUpdate.review = review;
        reviewToUpdate.stars = stars;

        await reviewToUpdate.save();

        res.status(200).json(reviewToUpdate);
    // } catch (error) {
    //     console.error(error);
    //     if (error instanceof ValidationError) {
    //       return res.status(400).json({ message: 'Validation error', errors: error.errors });
    //     } else {
    //       return res.status(500).json({ message: 'Internal Server Error' });
    //     }
    // }
    
});

router.delete('/:reviewId', restoreUser, requireAuth, async (req, res) => {
    const reviewById = await Review.findByPk(req.params.reviewId);

    if (!reviewById) {
        return res.status(404).json({ message: "Review couldn't be found" })
    }
    
    if (reviewById.userId !== req.user.id) {
        return res.status(403).json({
            message: "Spot must belong to user"
        })
    } 

    await reviewById.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
})


module.exports = router;