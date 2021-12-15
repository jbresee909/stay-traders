import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import FloatingLabel from "react-bootstrap-floating-label";
import "./Register.css";

function Register(props) {
    // Set state variables
    const [registerFirstName, setRegisterFirstName] = useState('first name');
    const [registerLastName, setRegisterLastName] = useState('last name');
    const [registerEmail, setRegisterEmail] = useState('email');
    const [registerPassword, setRegisterPassword] = useState('password');
    const [registerVeriftyPassword, setRegisterVerifyPassword] = useState('verify password');
    const [message, setMessage] = useState(null);

    // Register a User
    const handleRegistration = (e) => {
        e.preventDefault();

        if (!isValidForm()) {
            console.log("Invalid Form");
            return
        };

        axios.post(process.env.REACT_APP_API + '/users/register', {
            firstName: registerFirstName,
            lastName: registerLastName,
            username: registerEmail.toLowerCase(),
            password: registerPassword
        }).then((res) => {
            if (res.data.success) props.setCurrentUserFirstName(res.data.firstName);
            else if (res.data.error) setMessage(res.data.error);
            else console.log(res.data);
        })
            .catch((err) => console.log(err))
    }

    const isValidForm = () => {
        if (!registerEmail.includes("@") || !registerEmail.includes(".")) {
            setMessage("Not a valid email");
            return false;
        }
        if (registerPassword !== registerVeriftyPassword) {
            setMessage("Passwords do not match")
            return false;
        }
        else return true;
    }

    return (
        <div id="register-form">
            <Card className="container p-3">
                <h2>Register</h2>
                <Form>
                    <Alert variant='danger' style={!message ? { display: "none" } : { display: 'block' }}>
                        {message}
                    </Alert>
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
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </Card>
        </div>
    );
}

export default Register