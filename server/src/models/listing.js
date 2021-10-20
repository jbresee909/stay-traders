let mongoose = require('mongoose');

// Listing Schema
let listingSchema = mongoose.Schema({
    image: {
        type: String
    }
});

let Listing = module.exports = mongoose.model('Listing', listingSchema);