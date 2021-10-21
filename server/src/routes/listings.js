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


    return router;
}