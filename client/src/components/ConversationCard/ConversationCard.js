import React, { useState, useEffect } from "react"
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ConversationCard.css";

function ConversationCard(props) {
    const [mostRecentMessage, setMostRecentMessage] = useState({ text: '' });


    useEffect(() => {
        // sort messages by date sent
        props.conversation.messages.sort((a, b) => (a.dateSent < b.dateSent) ? 1 : ((b.dateSent < a.dateSent) ? -1 : 0))
        setMostRecentMessage(props.conversation.messages[0])

        console.log(props.conversation._id)
    }, [])


    return (
        <Link to={"/conversations/" + props.conversation._id} style={{ textDecoration: 'none', color: '#333' }}>
            <Card className="conversation-card">
                <Card.Header>
                    <>{props.conversation.users[0].firstName}</>
                    <p className="date-stamp">{new Date(mostRecentMessage.dateSent).toLocaleDateString("en-US")}</p>
                </Card.Header>
                <Card.Body><p>{mostRecentMessage.text}</p></Card.Body>
            </Card>
        </Link>
    )
}

export default ConversationCard;