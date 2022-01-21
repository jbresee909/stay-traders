import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./Conversation.css";
import { Card, InputGroup, FormControl, Button } from "react-bootstrap";

function Conversation(props) {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('');
    const [listingsInfo, setListingsInfo] = useState([]);
    const [showListingInfo, setShowListingInfo] = useState(false);
    let { conversationID } = useParams();
    const messagesEndRef = useRef(null)

    useEffect(() => {
        checkForNewMessages();
        getListingsInfo();
    }, [])

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const checkForNewMessages = async () => {
        while (props.currentUserFirstName) {
            getMessages();
            await delay(5000);
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const getMessages = () => {
        axios.get(process.env.REACT_APP_API + '/messages/conversation/' + conversationID, { withCredentials: true })
            .then((res) => {
                setMessages(res.data[0].messages.sort((a, b) => (a.dateSent > b.dateSent) ? 1 : ((b.dateSent > a.dateSent) ? -1 : 0)))
                scrollToBottom();
            })
            .catch((err) => console.error(err))
    }

    const getListingsInfo = () => {
        axios.get(process.env.REACT_APP_API + '/messages/conversation/' + conversationID, { withCredentials: true })
            .then((res) => {
                setListingsInfo(res.data[0].matchListingsInfo)
            })
            .catch((err) => console.error(err))
    }

    const Message = (props) => {
        return (
            <Card className="message" style={props.currentUserID === props.message.fromUserID ? { marginInlineStart: "auto", backgroundColor: "#0d6efd", color: "white" } : { marginInlineStart: "0px" }} >
                <Card.Body>{props.message.text}</Card.Body>
            </Card >
        )
    }

    const handlePostMessage = () => {
        axios.post(process.env.REACT_APP_API + '/messages/post-message', { text: message, conversationID: conversationID }, { withCredentials: true })
            .then(() => {
                getMessages();
                setMessage('');
            })
            .catch((err) => console.error(err))
    }

    return (
        <div className="messages container">
            {messages.map((message, index) => {
                return (
                    <Message message={message} key={index} currentUserID={props.currentUserID} />
                )
            })}
            <InputGroup className="mb-3">
                <InputGroup.Text id="send-button" onClick={handlePostMessage}>Send</InputGroup.Text>
                <FormControl
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Type Message Here'
                    value={message}
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                />
            </InputGroup>
            <Button onClick={() => setShowListingInfo(!showListingInfo)}>{showListingInfo ? "Hide Details" : "Show Details"}</Button>
            <div id="listing-info" style={showListingInfo ? { display: "" } : { display: "none" }}>
                {listingsInfo.map((listing) => {
                    return (
                        <div className="listing-info-card">
                            <div className="listing-details">
                                <h3>{listing.title}</h3>
                                <p>{listing.city}, {listing.state}</p>
                            </div>
                            <div className="listing-thumbnail" style={{ backgroundImage: "url(" + listing.imageURLs[0] + ")" }}></div>
                        </div>
                    )
                })}
            </div>
            <div ref={messagesEndRef} />
        </div>
    )
}

export default Conversation;