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
    lastActivity: {
        type: Date
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