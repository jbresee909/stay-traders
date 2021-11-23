module.exports = () => {
    const express = require("express");
    const router = express.Router();
    const Conversation = require('../models/conversation');

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
        let newConversation = new Conversation({
            users: [
                {
                    userID: req.user.id,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName
                },
                {
                    userID: 'test',
                    firstName: req.user.firstName,
                    lastName: req.user.lastName
                }
            ],
            messages: [
                {
                    text: "testing",
                    fromUserID: req.user.id,
                    dateSent: new Date()
                },
                {
                    text: "testing2",
                    fromUserID: req.user.id,
                    dateSent: new Date('1/1/2020')
                },
                {
                    text: "testing3",
                    fromUserID: req.user.id,
                    dateSent: new Date('1/1/2019')
                },
                {
                    text: "testing2",
                    fromUserID: req.user.id,
                    dateSent: new Date('1/1/2015')
                },
                {
                    text: "This is the text that should be showing",
                    fromUserID: req.user.id,
                    dateSent: new Date('1/1/2025')
                }
            ],
            text: req.body.text,
            dateCreated: new Date(),
            deletedByUsers: []
        })

        newConversation.save();

        res.send('message saved');
    })

    return router;
}