module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const Conversation = require('../models/conversation');
    const User = require("../models/user");

    // Routes
    router.get('/conversation/:conversationID', (req, res) => {
        // mark all messages from conversation as read if sent by a different user
        Conversation.findById(req.params.conversationID).exec((err, conversation) => {
            if (err) console.error(err)
            else {
                let updatedMessages = conversation.messages;
                updatedMessages.forEach((message) => {
                    if (String(message.fromUserID) !== String(req.user.id)) message.read = true;
                });

                Conversation.findByIdAndUpdate(req.params.conversationID, { messages: updatedMessages }).exec((err2) => {
                    if (err2) console.error(err2);
                })
            }
        })

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
                            read: false,
                            dateSent: new Date()
                        }
                    ],
                    lastActivity: new Date(),
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
                    read: false,
                    dateSent: new Date()
                })

                Conversation.findByIdAndUpdate(req.body.conversationID, { messages: messages, lastActivity: new Date() }).exec((error) => {
                    if (error) console.error(error)
                    else res.send("message posted!")
                })
            })
        }
    })

    // GET all conversations that have unread messages
    router.get('/unread-message-count', (req, res) => {
        Conversation.find({ "messages.read": false })
            .exec((err, conversations) => {
                if (err) console.error(err);
                else {
                    // loop through all the messages and count any the are not from the current user.
                    let unreadMessageCount = 0
                    conversations.forEach((conversation) => {

                        conversation.messages.forEach((message) => {
                            if (!message.read && message.fromUserID != String(req.user.id)) unreadMessageCount++;
                        })

                    })

                    res.send({ count: unreadMessageCount })
                }
            })
    })

    return router;
}