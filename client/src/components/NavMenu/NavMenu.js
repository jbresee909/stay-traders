import React from "react"
import { NavDropdown } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom"
import "./NavMenu.css"

function NavMenu(props) {
    const handleLogout = () => {
        axios.post(process.env.REACT_APP_API + '/users/logout', { withCredentials: true })
            .then((res) => {
                console.log(res)
                props.setCurrentUserFirstName(null)
            })
            .catch((err) => console.log(err))
    }

    if (props.isUserLoggedIn) {
        return (
            <>
                <NavDropdown.Item >Messages</NavDropdown.Item>
                <NavDropdown.Item >Favorites</NavDropdown.Item>
                <NavDropdown.Divider />
                <Link to="/listings"><NavDropdown.Item href="/listings" className="nav-menu-link">Your Listings</NavDropdown.Item> </Link>
                <NavDropdown.Item >Account</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} style={{ color: "red" }}> Logout</NavDropdown.Item>
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