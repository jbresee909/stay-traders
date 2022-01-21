import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import axios from 'axios';
import { Navbar, Container, Image, NavDropdown, Nav, Modal, Button, InputGroup, FormControl, Alert } from "react-bootstrap"
import "./styles/app.css";

//Import Pages
import Home from './components/pages/Home/Home'
import Login from './components/pages/Login/Login'
import Register from './components/pages/Register/Register'
import TermsOfService from './components/pages/Terms of Service/TermsOfService'
import Listings from './components/pages/Listings/Listings'
import Messages from './components/pages/Messages/Messages'
import Conversation from './components/pages/Conversation/Conversation'
import About from './components/pages/About/About';


// Import Components
import NavMenu from './components/NavMenu/NavMenu';


function App() {
  const [currentUserFirstName, setCurrentUserFirstName] = useState(null);
  const [currentUserLastName, setCurrentUserLastName] = useState(null);
  const [currentUserUsername, setCurrentUserUsername] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpRequestEmail, setHelpRequestEmail] = useState('');
  const [helpRequestMessage, setHelpRequestMessage] = useState('');
  const [helpRequestFeedback, setHelpRequestFeedback] = useState({ variant: 'success', message: '' })

  const handleCloseHelpModal = () => setShowHelpModal(false);
  const handleShowHelpModal = () => setShowHelpModal(true);

  useEffect(() => {
    // Get the user that is currently logged in    
    axios.get(process.env.REACT_APP_API + '/users/user', { withCredentials: true })
      .then((res) => {
        if (res.data.firstName === undefined) setCurrentUserFirstName(null)
        else {
          setCurrentUserFirstName(res.data.firstName)
          setCurrentUserLastName(res.data.lastName)
          setCurrentUserUsername(res.data.username)
          setCurrentUserID(res.data.id);

          // Get Count of Unread Messages
          getUnreadMessageCount();
        }
      })
      .catch(() => console.log("No User Logged In."))

  }, [currentUserFirstName, currentUserID])

  const getUnreadMessageCount = () => {
    // Only make call for unread messages when user is logged in.
    if (currentUserFirstName) {
      axios.get(process.env.REACT_APP_API + '/messages/unread-message-count', { withCredentials: true })
        .then((data) => setUnreadMessageCount(data.data.count))
        .catch((err) => console.error(err));
    }
  }

  const submitHelpRequest = () => {
    if (!helpRequestEmail.includes('@')) {
      setHelpRequestFeedback({ variant: 'danger', message: 'Email not valid' })
      return;
    }

    if (helpRequestMessage === '') {
      setHelpRequestFeedback({ variant: 'danger', message: 'Please enter a message' })
      return
    }

    axios.post(process.env.REACT_APP_API + '/users/submit-help-request', { email: helpRequestEmail, message: helpRequestMessage })
      .then(() => setHelpRequestFeedback({ variant: 'success', message: 'Request Submitted!' }))
      .catch((err) => console.error(err))
  }

  return (
    <Router>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Container>
          <img id='help-button'
            src="https://img.icons8.com/color/64/000000/help--v1.png"
            onClick={handleShowHelpModal}
          />
          <Navbar.Brand href="/">Stay Traders</Navbar.Brand>
          <div>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" style={unreadMessageCount > 0 ? { position: "relative" } : { position: "inherit" }} />
            <span id="unread-message-count-toggle" style={unreadMessageCount > 0 ? { display: "block" } : { display: "none" }}>{unreadMessageCount}</span>
          </div>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" style={currentUserFirstName ? { visibility: "hidden" } : { visibility: "show" }}>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
            <Nav>
              <span id="unread-message-count" style={unreadMessageCount > 0 ? { display: "block" } : { display: "none" }}>{unreadMessageCount}</span>
              <NavDropdown title={!currentUserFirstName ? "Menu" : currentUserFirstName} className="nav-dropdown-button" id="collasible-nav-dropdown">
                <NavMenu isUserLoggedIn={currentUserFirstName ? true : false}
                  setCurrentUserFirstName={setCurrentUserFirstName}
                  unreadMessageCount={unreadMessageCount}
                  currentUserFirstName={currentUserFirstName}
                  currentUserLastName={currentUserLastName}
                  currentUserUsername={currentUserUsername} />
              </NavDropdown>
              <Image src="https://img.icons8.com/ios/50/000000/cat-profile.png" id="profile-pic" />
            </Nav>
          </Navbar.Collapse>
          <Modal show={showHelpModal} onHide={handleCloseHelpModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Need Help?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Alert variant={helpRequestFeedback.variant} style={helpRequestFeedback.message === '' ? { display: 'none' } : { display: '' }}>
                {helpRequestFeedback.message}
              </Alert>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Email"
                  aria-label="Enter Email"
                  onChange={(e) => setHelpRequestEmail(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <FormControl as="textarea"
                  aria-label="Enter Help Request"
                  placeholder="Type your question or request and we will get back to you soon."
                  onChange={(e) => setHelpRequestMessage(e.target.value)}
                />
              </InputGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseHelpModal}>
                Close
              </Button>
              <Button variant="primary" onClick={submitHelpRequest}>
                Submit Request
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </Navbar>
      <div>

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            {!currentUserFirstName ? <Login setCurrentUserFirstName={setCurrentUserFirstName} /> : <Redirect to="/" />}
          </Route>
          <Route path="/register">
            {!currentUserFirstName ? <Register setCurrentUserFirstName={setCurrentUserFirstName} /> : <Redirect to="/" />}
          </Route>
          <Route path="/terms-of-service">
            <TermsOfService />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/listings">
            {!currentUserFirstName ? <Redirect to="/" /> : <Listings />}
          </Route>
          <Route path="/messages">
            {!currentUserFirstName ? <Redirect to="/" /> : <Messages />}
          </Route>
          <Route path="/conversations/:conversationID" >
            {!currentUserFirstName ? <Redirect to="/" /> : <Conversation currentUserID={currentUserID} currentUserFirstName={currentUserFirstName} />}
          </Route>
          <Route path="/">
            {<Home currentUserFirstName={currentUserFirstName} setCurrentUserFirstName={setCurrentUserFirstName} />}
          </Route>
        </Switch>
      </div>
    </Router >
  );
}

export default App;
