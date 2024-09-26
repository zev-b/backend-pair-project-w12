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

    // console.log(`Current User id ====>`, req.user.id);

    const currentReviews = await Review.findAll({
        where: {
            userId: currentUserId,
        },
        include: [
            {
                model: Spot,
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],            
            },
            // {
            //     model: SpotImage,
            //     where: {
            //         preview: true,
            //     },
            //     attributes: ['url'],
            //     // as: 'previewImage',
            // },
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

    // const getImageInfo = await SpotImage.findOne({
    //     where: {
    //         spotid: currentReviews.spotId,
    //         preview: true,
    //     }
    // });

    console.log(currentReviews, `<#################`);

    if (!currentReviews.length) {
        return res.status(200).json({ message: 'No reviews found for user'});
    }   

    const reviewsDeets = currentReviews.map(review => { 
        const previewImg = getPreviewImg(review.Spot.SpotImages);

        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: review.User, 
            Spot: review.Spot,
            ReviewImages: review.ReviewImages
        }

    });

    // console.log(currentReviews, `<========`); 

    res.status(200).json({ Reviews: reviewsDeets });
}) 



module.exports = router;