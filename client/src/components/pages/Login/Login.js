import React, { useState } from 'react';
import axios from 'axios';
import { Form, Alert, Button, Card } from 'react-bootstrap';
import FloatingLabel from "react-bootstrap-floating-label";
import "./Login.css"

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
        <Card className="container p-3">
            <h2>Login</h2>
            <Form>
                <Alert variant='danger' style={message === '' ? { display: "none" } : { display: 'block' }}>
                    {message}
                </Alert>
                <FloatingLabel
                    controlId="username"
                    label="Email address"
                    className="mb-3"
                    onChange={(e) => setLoginUsername(e.target.value)}
                >
                    <Form.Control type="email" placeholder="name@example.com" />
                </FloatingLabel>
                <FloatingLabel
                    controlId="password"
                    label="Password"
                    className="mb-3 secure-text"
                    onChange={(e) => setLoginPassword(e.target.value)}
                >
                    <Form.Control type="password" placeholder="Password" />
                </FloatingLabel>
                <Button className="mt-2 mb-2" type="submit" variant="primary" onClick={(e) => handleLogin(e)}>Login</Button>
            </Form>
            <p>Don't have an account? <a href='/Register'>Register</a></p>
        </Card>
    );
}

export default Login