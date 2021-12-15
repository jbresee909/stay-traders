import { React, useEffect, useState } from "react"
import axios from "axios";
import ConversationCard from "../../ConversationCard/ConversationCard";
import "./Messages.css";

function Messages() {
    const [conversations, setConversations] = useState([])

    useEffect(() => {
        getConversations();
    }, [])

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