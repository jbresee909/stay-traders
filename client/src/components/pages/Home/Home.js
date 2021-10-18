import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home(props) {
    const [message, setMessage] = useState('')

    useEffect(() => {
        // Frontend check to check database connection
        axios.get(process.env.REACT_APP_API + '/users/hello', { withCredentials: true })
            .then((res) => setMessage(res.data.msg))
            .catch((err) => console.log(err))
    })

    return (
        <div>
            <h1>Welcome, {props.currentUserFirstName}</h1>
            <p>From the database: {message}</p>
        </div>);
}

export default Home;