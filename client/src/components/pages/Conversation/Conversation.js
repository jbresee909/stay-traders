import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./Conversation.css";

function Conversation() {
    const [messages, setMessages] = useState([])
    let { conversationID } = useParams();

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + '/messages/conversation/' + conversationID, { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                setMessages(res.data[0].messages.sort((a, b) => (a.dateSent > b.dateSent) ? 1 : ((b.dateSent > a.dateSent) ? -1 : 0)))
            })
            .catch((err) => console.error(err))
    }, [])

    console.log(messages);

    return (
        <div class="messages container">
            {messages.map((message, index) => {
                return (
                    <h4 key={index} >{message.text}</h4>
                )
            })}
        </div>
    )
}

export default Conversation;