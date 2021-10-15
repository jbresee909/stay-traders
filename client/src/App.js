import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import axios from 'axios';
import { Navbar, Container, Image, NavDropdown, Nav } from "react-bootstrap"

//Import Pages
import Home from './components/pages/Home/Home'
import Login from './components/pages/Login/Login'
import Register from './components/pages/Register/Register'



function App() {
  const [currentUserFirstName, setCurrentUserFirstName] = useState(null)

  useEffect(() => {
    // Get the user that is currently logged in    
    axios.get(process.env.REACT_APP_API + '/users/user', { withCredentials: true })
      .then((res) => {
        if (res.data.firstName === undefined) setCurrentUserFirstName('')
        else setCurrentUserFirstName(res.data.firstName)
      })
      .catch((err) => console.log(err))
  }, [])


  return (
    <Router>
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Stay Traders</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title={currentUserFirstName} id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
              <Image src="https://img.icons8.com/ios/50/000000/cat-profile.png" />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            {currentUserFirstName === '' ? <Login setCurrentUserFirstName={setCurrentUserFirstName} /> : <Redirect to="/" />}
          </Route>
          <Route path="/register">
            {currentUserFirstName === '' ? <Register /> : <Redirect to="/" />}
          </Route>
          <Route path="/">
            {currentUserFirstName === '' ? <Redirect to="/login" /> : <Home currentUserFirstName={currentUserFirstName} setCurrentUserFirstName={setCurrentUserFirstName} />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
