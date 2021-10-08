import React, { useState } from 'react';
import axios from 'axios';

function Home() {
    const API_URL = process.env.REACT_APP_API;

    const [currentUser, setCurrentUser] = useState('')
    const getCurrentUser = () => {
        axios({
            method: 'GET',
            url: API_URL + '/users/user',
            withCredentials: true
        })
    }
    return (
        <div>
            <h1>Welcome, {currentUser}</h1>
            <button onClick={getCurrentUser}>Get Current User</button>
        </div>);
}

export default Home;