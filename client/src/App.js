import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import axios from 'axios';
import { Navbar, Container, Image, NavDropdown, Nav } from "react-bootstrap"
import "./styles/app.css";

//Import Pages
import Home from './components/pages/Home/Home'
import Login from './components/pages/Login/Login'
import Register from './components/pages/Register/Register'
import Listings from './components/pages/Listings/Listings'
import Messages from './components/pages/Messages/Messages'
import Conversation from './components/pages/Conversation/Conversation'


// Import Components
import NavMenu from './components/NavMenu/NavMenu';


function App() {
  const [currentUserFirstName, setCurrentUserFirstName] = useState(null);
  const [currentUserLastName, setCurrentUserLastName] = useState(null);
  const [currentUserUsername, setCurrentUserUsername] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

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
      .catch((err) => console.log(err))

  }, [currentUserFirstName, currentUserID])

  const getUnreadMessageCount = () => {
    axios.get(process.env.REACT_APP_API + '/messages/unread-message-count', { withCredentials: true })
      .then((data) => setUnreadMessageCount(data.data.count))
      .catch((err) => console.error(err));
  }

  return (
    <Router>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">Stay Traders</Navbar.Brand>
          <div>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
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
          <Route path="/listings">
            {!currentUserFirstName ? <Redirect to="/" /> : <Listings />}
          </Route>
          <Route path="/messages">
            {!currentUserFirstName ? <Redirect to="/" /> : <Messages />}
          </Route>
          <Route path="/conversations/:conversationID" >
            {!currentUserFirstName ? <Redirect to="/" /> : <Conversation currentUserID={currentUserID} />}
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
