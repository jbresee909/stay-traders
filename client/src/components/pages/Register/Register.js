import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import FloatingLabel from "react-bootstrap-floating-label";
import "./Register.css";


function Register() {
    // Set state variables
    const [registerFirstName, setRegisterFirstName] = useState('first name');
    const [registerLastName, setRegisterLastName] = useState('last name');
    const [registerEmail, setRegisterEmail] = useState('email');
    const [registerPassword, setRegisterPassword] = useState('password');
    const [registerVeriftyPassword, setRegisterVerifyPassword] = useState('verify password');

    // Register a User
    const handleRegistration = () => {
        axios.post(process.env.REACT_APP_API + '/users/register', {
            firstName: registerFirstName,
            lastName: registerLastName,
            username: registerEmail,
            password: registerPassword
        }).then((data) => console.log(data))
            .catch((err) => console.log(err))
    }
    return (
        <div>
            <Card className="container p-3">
                <h2>Register</h2>
                <Form>
                    <FloatingLabel
                        controlId="firstName"
                        label="First Name"
                        className="mb-3"
                        onChange={(e) => setRegisterFirstName(e.target.value)}
                    >
                        <Form.Control type="name" placeholder="First Name" />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="lastName"
                        label="Last Name"
                        className="mb-3"
                        onChange={(e) => setRegisterLastName(e.target.value)}
                    >
                        <Form.Control type="name" placeholder="Last Name" />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="username"
                        label="Email"
                        className="mb-3"
                        onChange={(e) => setRegisterEmail(e.target.value)}
                    >
                        <Form.Control type="email" placeholder="Email" />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="password"
                        label="Password"
                        className="mb-3 secure-text"
                        onChange={(e) => setRegisterPassword(e.target.value)}
                    >
                        <Form.Control type="password" placeholder="Password" />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="verifyPassword"
                        label="Verify Password"
                        className="mb-3 secure-text"
                        onChange={(e) => setRegisterVerifyPassword(e.target.value)}
                    >
                        <Form.Control type="password" placeholder="Verifty Password" />
                    </FloatingLabel>
                    <Button className="mt-2 mb-2" type="submit" variant="primary" onClick={(e) => handleRegistration(e)}>Register</Button>
                </Form>
                <p>Already have an account? <a href='/Register'>Login</a></p>
            </Card>
        </div>
    );
}

export default Register