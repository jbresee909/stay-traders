let mongoose = require('mongoose');

// Listing Schema
let listingSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    imageURLs: {
        type: Array
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

module.exports = mongoose.model('Listing', listingSchema);