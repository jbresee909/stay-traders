let mongoose = require('mongoose');

// LIke Schema
let conversationSchema = mongoose.Schema({
    users: {
        type: Array,
        required: true
    },
    messages: {
        type: Array
    },
    dateCreated: {
        type: Date,
        required: true
    },
    deletedByUsers: {
        type: Array
    }
});

module.exports = mongoose.model('Conversation', conversationSchema);