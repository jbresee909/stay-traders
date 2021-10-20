module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const Listing = require('../models/listing');

    // Routes
    router.post('/add', (req, res) => {
        const image = req.body.data

        const newListing = new Listing({
            image: image
        })

        newListing.save().then(() => res.send('New Listing Created!')).catch((err) => console.error(err));
    })


    return router;
}