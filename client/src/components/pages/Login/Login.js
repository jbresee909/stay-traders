import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { Form, Alert, Button, Card, Modal, FormControl, InputGroup } from 'react-bootstrap';
import FloatingLabel from "react-bootstrap-floating-label";
import "./Login.css"

function Login(props) {
    const [message, setMessage] = useState(null)
    const [loginUsername, setLoginUsername] = useState('email')
    const [loginPassword, setLoginPassword] = useState('password')
    const [showRecoverPasswordModal, setShowRecoverPasswordModa] = useState(false);
    const [passwordRecoveryEmail, setPasswordRecoveryEmail] = useState();
    const [passwordRecoveryModalSlide, setPasswordRecoveryModalSlide] = useState(0);
    const [passwordRecoveryQuestions, setPasswordRecoveryQuestions] = useState([]);
    const [passwordRecoveryQuestionAnswers, setPasswordRecoveryQuestionAnswers] = useState(['', '', '']);
    const [passwordRecoveryUserID, setPasswordRecoveryUserID] = useState();
    const [passwordRecoveryMessage, setPasswordRecoveryMessage] = useState({ variant: "success", message: "" });
    const [newPassword, setNewPassword] = useState();
    const [verifyNewPassword, setVerifyNewPassword] = useState();

    const handleCloseRecoverPasswordModal = () => setShowRecoverPasswordModa(false);
    const handleShowRecoverPasswordModal = () => setShowRecoverPasswordModa(true);

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

    const getRecoverPasswordModalSlide = () => {
        switch (passwordRecoveryModalSlide) {
            case (0):
                return (
                    <FormControl
                        placeholder="Enter Email"
                        aria-label="recovery-email"
                        onChange={(e) => setPasswordRecoveryEmail(e.target.value)}
                    />
                )
            case (1):
                return (
                    <>
                        <Form.Label>{passwordRecoveryQuestions[0]}</Form.Label>
                        <FormControl
                            placeholder="Type answer here"
                            aria-label="recovery-email"
                            onChange={(e) => {
                                let answers = [...passwordRecoveryQuestionAnswers];
                                answers[0] = e.target.value;
                                setPasswordRecoveryQuestionAnswers(answers);
                            }}
                        />
                        <Form.Label className="mt-2">{passwordRecoveryQuestions[1]}</Form.Label>
                        <FormControl
                            placeholder="Type answer here"
                            aria-label="recovery-email"
                            onChange={(e) => {
                                let answers = [...passwordRecoveryQuestionAnswers];
                                answers[1] = e.target.value;
                                setPasswordRecoveryQuestionAnswers(answers);
                            }}
                        />
                        <Form.Label className="mt-2">{passwordRecoveryQuestions[2]}</Form.Label>
                        <FormControl
                            placeholder="Type answer here"
                            aria-label="recovery email"
                            onChange={(e) => {
                                let answers = [...passwordRecoveryQuestionAnswers];
                                answers[2] = e.target.value;
                                setPasswordRecoveryQuestionAnswers(answers);
                            }}
                            className="mb-3"
                        />
                    </>
                )
            case (2):
                return (
                    <>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Enter New Password"
                                aria-label="enter new password"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Verify New Password"
                                aria-label="verify new passord"
                                onChange={(e) => setVerifyNewPassword(e.target.value)}
                            />
                        </InputGroup>
                    </>
                )
            default:
                return (<p>Something went wrong</p>)
        }
    }

    const getSecurityQuestions = (email) => {
        axios.get(process.env.REACT_APP_API + '/users/security-questions/' + email)
            .then((res) => {
                setPasswordRecoveryQuestions(res.data.questions);
                setPasswordRecoveryUserID(res.data.userID);
                setPasswordRecoveryModalSlide(passwordRecoveryModalSlide + 1)
                setPasswordRecoveryMessage({ variant: "success", message: "" })
            })
            .catch((err) => {
                console.error(err)
                setPasswordRecoveryMessage({ variant: "danger", message: "Email not found in database." })
            })
    }

    const answersAreCorrect = () => {
        axios.post(process.env.REACT_APP_API + '/users/check-security-answers', { answers: passwordRecoveryQuestionAnswers, userID: passwordRecoveryUserID })
            .then((res) => {
                if (res.data) {
                    setPasswordRecoveryModalSlide(passwordRecoveryModalSlide + 1)
                    setPasswordRecoveryMessage({ variant: "success", message: "" })
                }
                else setPasswordRecoveryMessage({ variant: "danger", message: "Incorrect Answers" })
            })
            .catch((err) => console.error(err))
    }

    const submitNewPassword = () => {
        if (newPassword !== verifyNewPassword) {
            setPasswordRecoveryMessage({ variant: "danger", message: "Passwords do not match" })
        } else {
            axios.post(process.env.REACT_APP_API + '/users/reset-password/', { userID: passwordRecoveryUserID, password: newPassword })
                .then((res) => {
                    setPasswordRecoveryMessage({ variant: "success", message: res.data })
                })
                .catch((err) => console.error(err))
        }
    }

    return (
        <div id="login-form">
            <Card className="container p-3">
                <h2>Login</h2>
                <Form>
                    <Alert variant='danger' style={!message ? { display: "none" } : { display: 'block' }}>
                        {message}
                    </Alert>
                    <FloatingLabel
                        controlId="username"
                        label="Email address"
                        className="mb-3"
                        onChange={(e) => setLoginUsername(e.target.value)}
                        type="email"
                    >
                        <Form.Control type="email" placeholder="name@example.com" />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="password"
                        label="Password"
                        className="mb-3 secure-text"
                        onChange={(e) => setLoginPassword(e.target.value)}
                        type="password"
                        name="password"
                    >
                        <Form.Control type="password" placeholder="Password" />
                    </FloatingLabel>
                    <Button className="mt-2 mb-2" type="submit" variant="primary" onClick={(e) => handleLogin(e)}>Login</Button>
                </Form>
                <p style={{ marginBottom: "0px" }} className="mt-2">Don't have an account? <Link to="/register">Register</Link> </p>
                <Link to="/login" onClick={handleShowRecoverPasswordModal}>Forgot Password?</Link>
            </Card>
            <Modal show={showRecoverPasswordModal} onHide={handleCloseRecoverPasswordModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Password Recovery</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant={passwordRecoveryMessage.variant} style={passwordRecoveryMessage.message === "" ? { display: "none" } : { display: "" }}>
                        <p style={{ marginBottom: "0px" }}>{passwordRecoveryMessage.message}</p>
                    </Alert>
                    {getRecoverPasswordModalSlide()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        switch (passwordRecoveryModalSlide) {
                            case (0):
                                getSecurityQuestions(passwordRecoveryEmail);
                                break;
                            case (1):
                                answersAreCorrect();
                                break;
                            case (2):
                                submitNewPassword();
                                break;
                            default:
                                setPasswordRecoveryModalSlide(0)
                        }

                    }}>
                        Next
                    </Button>
                    <Button variant="secondary" onClick={handleCloseRecoverPasswordModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Login