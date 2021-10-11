import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const API_URL = window.location.href.includes('localhost') ? 'http://localhost:8080/api' : null

    console.log(API_URL);

    const [currentUser, setCurrentUser] = useState('')
    const [message, setMessage] = useState('')
    const getCurrentUser = () => {
        axios({
            method: 'GET',
            url: API_URL + '/users/user',
            withCredentials: true
        }).then((data) => {
            console.log(data)
            setCurrentUser(data.data.firstName)
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        axios.get(API_URL + '/users/hello')
            .then((res) => setMessage(res.data.msg))
            .catch((err) => console.log(err))
    })

    console.log(window.location.href);

    return (
        <div>
            <h1>Welcome, {currentUser}</h1>
            <p>From the database: {message}</p>
            <button onClick={getCurrentUser}>Get Current User</button>
        </div>);
}

export default Home;