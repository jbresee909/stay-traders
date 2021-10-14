import React, { useState } from 'react';
import axios from 'axios';

function Login(props) {
    const [message, setMessage] = useState('')
    const [loginUsername, setLoginUsername] = useState('email')
    const [loginPassword, setLoginPassword] = useState('password')
    const handleLogin = (e) => {
        // prevent page reload
        e.preventDefault()

        axios.post(process.env.REACT_APP_API + '/users/login', {
            username: loginUsername,
            password: loginPassword
        }, { withCredentials: true }).then((res) => {
            if (res.data.success) props.setCurrentUserFirstName(res.data.firstName)
            else setMessage(res.data.error)
        }).catch((err) => console.log(err))
    }
    return (
        <div>
            <p>{message}</p>
            <form>
                <input placeholder={loginUsername} onChange={(e) => setLoginUsername(e.target.value)}></input>
                <input placeholder={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}></input>
                <button onClick={(e) => handleLogin(e)}>Submit</button>
            </form>
            <a href='/Register'>Register</a>
        </div>
    );
}

export default Login