
module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const Listing = require('../models/listing');
    const Like = require("../models/like");
    const { cloudinary } = require('../utils/cloudinary');

    // Routes
    router.post('/add', async (req, res) => {
        try {
            const imageURLs = [];

            for (let i = 0; i < req.body.data.images.length; i++) {
                const fileStr = req.body.data.images[i];
                const uploadResponse = await cloudinary.uploader.upload(fileStr, {
                    upload_preset: 'staytraders',
                });

                imageURLs.push(uploadResponse.url);
            }


            let newListing = new Listing({
                userID: req.user.id,
                imageURLs: imageURLs,
                title: req.body.data.title,
                description: req.body.data.description,
                city: req.body.data.city,
                state: req.body.data.state
            })

            newListing.save();
            res.json(newListing);

        } catch (err) {
            console.error(err);
            res.status(500).json({ err: 'Something went wrong' });
        }
    })

    router.get('/users-listings', (req, res) => {
        Listing.find({ userID: req.user.id, deleted: false }).exec((err, records) => {
            if (err) console.error(err)
            res.send(records);
        })
    })

    router.post('/delete', (req, res) => {
        Listing.updateOne({ _id: req.body.id }, { deleted: true }, (error, response) => {
            if (error) res.json({ error: error, success: null })
            else res.json({ error: null, success: response })
        })
    })

    router.post('/edit', (req, res) => {
        Listing.updateOne({ _id: req.body.id }, { title: req.body.title, description: req.body.description }, (error, response) => {
            if (error) res.json({ error: error, success: null })
            else res.json({ error: null, success: response })
        })
    })

    router.get('/get-listing-batch', (req, res) => {
        if (req.user) {
            Like.find({ liked_or_disliked_by_userID: req.user.id }).exec((err, likedListings) => {
                if (err) console.error(err);
                else {
                    // Get listings user has already liked to avoid duplicates
                    let likedListingIds = likedListings.map((like) => like.listingID)

                    // Get User Ids of other users who liked liked current user's posts
                    Like.find({ listing_user_id: req.user.id })
                        .where("userID")
                        .ne(req.user.id)
                        .limit(10)
                        .exec((error, likedByOthers) => {
                            if (error) console.error(error)
                            else {
                                let likedByOthersUserIds = likedByOthers.map((like) => like.liked_or_disliked_by_userID)

                                // Get listings that are from users that liked your listing(s)
                                Listing.find({ deleted: false })
                                    .where("userID")
                                    .in(likedByOthersUserIds)
                                    .where("userID")
                                    .ne(req.user.id)
                                    .where("_id")
                                    .nin(likedListingIds)
                                    .limit(10)
                                    .exec((error, records) => {
                                        let likedByOthersListingIds = records.map((listing) => String(listing._id))

                                        if (error) console.error(error)
                                        // Get other listings that you have not yet liked
                                        Listing.find({ deleted: false })
                                            .where("_id")
                                            .nin(likedListingIds)
                                            .where("_id")
                                            .nin(likedByOthersListingIds)
                                            .where("userID")
                                            .ne(req.user.id)
                                            .limit(10)
                                            .exec((error1, records1) => {
                                                let listings = [...new Set(records.concat(records1))];

                                                if (error1) console.error(err);
                                                else res.json(listings);
                                            })
                                    })
                            }
                        })
                }
            })
        }
        else {
            Listing.find({ deleted: false })
                .exec((err, records) => {
                    if (err) console.error(err);
                    else res.json(records);
                })
        }
    })

    router.post('/post-like', (req, res) => {
        let newLike = new Like({
            listingID: req.body.listing._id,
            listing_user_id: req.body.listing.userID,
            is_like: req.body.isLike,
            liked_or_disliked_by_userID: req.user.id,
            date_entered: new Date()
        });

        newLike.save();

        res.send("like posted")
    })

    router.get('/:listingID', (req, res) => {
        Listing.findById(req.params.listingID).exec((err, record) => {
            if (err) console.error(err);
            else res.send(record)
        })
    })

    router.post('/is-a-match', (req, res) => {
        Like.find({
            listing_user_id: req.user.id,
            liked_or_disliked_by_userID: req.body.listing.userID,
            is_like: true
        }).limit(1)
            .exec((err, records) => {
                if (err) console.error(err)
                else if (records.length === 0) res.send({ match: null })
                else res.send({
                    match: {
                        firstListing: req.body.listing._id, // listing the user just liked
                        secondListing: records[0].listingID // the listing other user liked 
                    }
                })
            })
    })


    return router;
}