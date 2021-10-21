let mongoose = require('mongoose');

// Listing Schema
let listingSchema = mongoose.Schema({
    imageURL: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    }
});

let Listing = module.exports = mongoose.model('Listing', listingSchema);