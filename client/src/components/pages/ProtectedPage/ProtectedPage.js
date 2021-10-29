import React from "react";
import { Redirect } from "react-router-dom";
import Listings from "../Listings/Listings";

function ProtectedPage(props) {
    if (!props.userFirstName) return <Redirect to="/login" />
    switch (props.page) {
        case 1:
            return <Listings />
        default:
            return <h1>No Page Found.</h1>
    }
}

export default ProtectedPage;