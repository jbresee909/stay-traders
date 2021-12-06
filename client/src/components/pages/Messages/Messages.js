import { React, useEffect, useState } from "react"
import axios from "axios";
import { Button } from "react-bootstrap";
import ConversationCard from "../../ConversationCard/ConversationCard";
import "./Messages.css";

function Messages() {
    const [conversations, setConversations] = useState([])

    useEffect(() => {
        getConversations();
    }, [])

    const handlePostMessage = () => {
        axios.post(process.env.REACT_APP_API + '/messages/post-message', { text: "test message", conversationID: null }, { withCredentials: true })
            .then(() => {
                getConversations();
            })
            .catch((err) => console.error(err))
    }

    const getConversations = () => {
        axios.get(process.env.REACT_APP_API + '/messages/conversations', { withCredentials: true })
            .then((res) => {
                setConversations(res.data)
            })
            .catch((err) => console.error(err))
    }

    return (
        <div className='container pt-3'>
            {conversations.map((conversation, key) => {
                return <ConversationCard conversation={conversation} key={key} />
            })}
        </div>
    )
}

export default Messages;