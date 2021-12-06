module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const Conversation = require('../models/conversation');
    const User = require("../models/user");

    // Routes
    router.get('/conversation/:conversationID', (req, res) => {
        Conversation.find({ _id: req.params.conversationID }).exec((err, records) => {
            if (err) console.error(err)
            res.send(records);
        })
    })

    router.get('/conversations', (req, res) => {
        Conversation.find({ deleted: false, 'users.userID': req.user.id })
            .sort({ 'dateCreated': 'desc' })
            .exec((err, conversations) => {
                if (err) console.error(err)
                res.send(conversations)
            })
    })

    router.post('/post-message', (req, res) => {
        console.log(req.body.listing)
        if (req.body.conversationID == null) {
            User.findById(req.body.listing.userID).exec((error, user) => {
                if (error) console.error(error);
                let newConversation = new Conversation({
                    users: [
                        {
                            userID: req.user.id,
                            firstName: req.user.firstName,
                            lastName: req.user.lastName
                        },
                        {
                            userID: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName
                        }
                    ],
                    messages: [
                        {
                            text: "Congrats! You've you both liked each other's properties. You can start messaging to figure out dates for when you want to stay at each other's place.",
                            fromUserID: 'system',
                            dateSent: new Date()
                        }
                    ],
                    dateCreated: new Date(),
                    deletedByUsers: []
                })

                newConversation.save();

                res.send(newConversation);
            })
        } else {
            Conversation.findById(req.body.conversationID).exec((err, conversation) => {
                if (err) console.error(err);
                let messages = conversation.messages;
                messages.push({
                    text: req.body.text,
                    fromUserID: req.user.id,
                    dateSent: new Date()
                })

                Conversation.findByIdAndUpdate(req.body.conversationID, { messages: messages }).exec((error) => {
                    if (error) console.error(error)
                    else res.send("message posted!")
                })
            })
        }
    })

    return router;
}