let mongoose = require('mongoose');

// LIke Schema
let likeSchema = mongoose.Schema({
    listingID: {
        type: String,
        required: true
    },
    listing_user_id: {
        type: String,
        required: true
    },
    is_like: {
        type: Boolean,
        required: true
    },
    liked_or_disliked_by_userID: {
        type: String,
        required: true
    },
    date_entered: {
        type: Date
    }
});

module.exports = mongoose.model('Like', likeSchema);