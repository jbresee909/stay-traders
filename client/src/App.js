import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import axios from 'axios';

//Import Pages
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Register from './components/pages/Register'



function App() {
  const [currentUserFirstName, setCurrentUserFirstName] = useState('')

  useEffect(() => {
    // Get the user that is currently logged in    
    axios.get(process.env.REACT_APP_API + '/users/user', { withCredentials: true })
      .then((res) => setCurrentUserFirstName(res.data.firstName))
      .catch((err) => console.log(err))
  }, [])


  return (
    <Router>
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
        <div>
          <h1>Stay Traders</h1>
        </div>

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
