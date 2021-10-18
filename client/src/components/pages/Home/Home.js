import React from 'react';
import "./Home.css"
import { Link } from "react-router-dom";

function Home(props) {
    if (props.currentUserFirstName) {
        return (<div id="home-page">
            <div id="home-hero">
                <h1>Welcome, {props.currentUserFirstName}</h1>
            </div>
        </div>)
    }
    else {
        return (
            <div id="home-page">
                <div id="home-hero">
                    <div>
                        <h1>Stay Traders</h1>
                        <Link to="/register">Start Trading</Link>
                    </div>
                </div>
            </div>)
    }

}

export default Home;