let mongoose = require('mongoose');

// Listing Schema
let listingSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    imageURL: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

let Listing = module.exports = mongoose.model('Listing', listingSchema);