import React, { useState } from 'react';
import axios from 'axios';

function Home() {
    const [currentUser, setCurrentUser] = useState('')
    const getCurrentUser = () => {
        axios({
            method: 'GET',
            url: '/api/users/user',
            withCredentials: true
        }).then((data) => setCurrentUser(data.data.firstName)).catch((err) => console.log(err))
    }
    return (
        <div>
            <h1>Welcome, {currentUser}</h1>
            <button onClick={getCurrentUser}>Get Current User</button>
        </div>);
}

export default Home;