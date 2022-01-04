import React, { useState } from "react"
import { NavDropdown, Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom"
import "./NavMenu.css"

function NavMenu(props) {

    const [showAccountModal, setShowAccountModal] = useState(false);

    const handleCloseAccountModal = () => setShowAccountModal(false);
    const handleShowAccountModal = () => setShowAccountModal(true);

    const handleLogout = () => {
        axios.post(process.env.REACT_APP_API + '/users/logout', { withCredentials: true })
            .then((res) => {
                props.setCurrentUserFirstName(null)
            })
            .catch((err) => console.log(err))
    }

    if (props.isUserLoggedIn) {
        return (
            <>
                <Link to="/messages">
                    <NavDropdown.Item href="/messages">Messages</NavDropdown.Item>
                    <span id="unread-message-count-dropdown" style={props.unreadMessageCount > 0 ? { display: "block" } : { display: "none" }}>{props.unreadMessageCount}</span>
                </Link>
                <NavDropdown.Divider />
                <Link to="/listings"><NavDropdown.Item href="/listings" className="nav-menu-link">Your Listings</NavDropdown.Item> </Link>
                <NavDropdown.Item onClick={handleShowAccountModal}>Account</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} style={{ color: "red" }}> Logout</NavDropdown.Item>

                <Modal show={showAccountModal}
                    onHide={handleCloseAccountModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Account Information</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h3>First Name</h3>
                        <p>{props.currentUserFirstName}</p>
                        <h3>Last Name</h3>
                        <p>{props.currentUserLastName}</p>
                        <h3>Email</h3>
                        <p>{props.currentUserUsername}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAccountModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
    else {
        return (
            <>
                <Link to="/login"><NavDropdown.Item href="/login" className="nav-menu-link">Login</NavDropdown.Item> </Link>
                <Link to="/register"><NavDropdown.Item href="/register">Register</NavDropdown.Item> </Link>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">About</NavDropdown.Item>
            </>
        )
    }

}

export default NavMenu