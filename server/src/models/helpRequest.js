let mongoose = require('mongoose');

// LIke Schema
let helpRequestSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    is_resolved: {
        type: Boolean,
        required: true
    },
    date_created: {
        type: Date
    }
});

module.exports = mongoose.model('Help_Request', helpRequestSchema);