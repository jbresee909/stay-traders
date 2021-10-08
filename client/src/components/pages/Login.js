import React, { useState } from 'react';
import axios from 'axios';

function Login() {

    const [loginUsername, setLoginUsername] = useState('email')
    const [loginPassword, setLoginPassword] = useState('password')
    const login = () => {
        axios({
            method: 'POST',
            url: '/api/users/login',
            withCredentials: true,
            data: {
                username: loginUsername,
                password: loginPassword
            }
        })
    }
    return (
        <div>
            <form>
                <input placeholder={loginUsername} onChange={(e) => setLoginUsername(e.target.value)}></input>
                <input placeholder={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}></input>
                <button onClick={login}>Submit</button>
            </form>
            <a href='/Register'>Register</a>
        </div>
    );
}

export default Login