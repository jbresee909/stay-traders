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

// Import Components
import NavMenu from './components/NavMenu/NavMenu';


function App() {
  const [currentUserFirstName, setCurrentUserFirstName] = useState(null);

  useEffect(() => {
    // Get the user that is currently logged in    
    axios.get(process.env.REACT_APP_API + '/users/user', { withCredentials: true })
      .then((res) => {
        if (res.data.firstName === undefined) setCurrentUserFirstName(null)
        else setCurrentUserFirstName(res.data.firstName)
      })
      .catch((err) => console.log(err))
  }, [])


  return (
    <Router>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="/">Stay Traders</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title={!currentUserFirstName ? "Menu" : currentUserFirstName} className="nav-dropdown-button" id="collasible-nav-dropdown">
                <NavMenu isUserLoggedIn={currentUserFirstName ? true : false} setCurrentUserFirstName={setCurrentUserFirstName} />
              </NavDropdown>
              <Image src="https://img.icons8.com/ios/50/000000/cat-profile.png" />
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
            <Listings />
          </Route>
          <Route path="/">
            {<Home currentUserFirstName={currentUserFirstName} setCurrentUserFirstName={setCurrentUserFirstName} />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
