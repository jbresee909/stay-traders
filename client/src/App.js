import { useEffect, useState } from "react";
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

//Import Pages
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Register from './components/pages/Register'



function App() {
  const [data, setData] = useState("No data :(");

  useEffect(() => {
    async function getData() {
      const url = `/api/users/hello`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setData(data.msg);
      } catch (e) {
        console.log(e);
      }
    }
    getData();
  }, []);

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
        <>
          <h1>MERN App!</h1>
          <p>Data from server: {data}</p>
        </>

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
