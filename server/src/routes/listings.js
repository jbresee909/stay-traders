
module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const Listing = require('../models/listing');
    const { cloudinary } = require('../utils/cloudinary');

    // Routes
    router.post('/add', async (req, res) => {
        try {
            const fileStr = req.body.data.image;
            const uploadResponse = await cloudinary.uploader.upload(fileStr, {
                upload_preset: 'staytraders',
            });

            let newListing = new Listing({
                userID: req.user.id,
                imageURL: uploadResponse.url,
                title: req.body.data.title,
                description: req.body.data.description
            })

            newListing.save();
            res.json(uploadResponse);

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
        console.log(req.body);
        Listing.updateOne({ _id: req.body.id }, { deleted: true }, (error, response) => {
            if (error) res.json({ error: error, success: null })
            else res.json({ error: null, success: response })
        })
    })

    router.post('/edit', (req, res) => {
        console.log(req.body);
        Listing.updateOne({ _id: req.body.id }, { title: req.body.title, description: req.body.description }, (error, response) => {
            if (error) res.json({ error: error, success: null })
            else res.json({ error: null, success: response })
        })
    })


    return router;
}