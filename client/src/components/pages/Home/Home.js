import React, { useState, useEffect } from 'react';
import "./Home.css"
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import axios from "axios";

function Home(props) {
    const [listings, setListings] = useState([{ imageURLs: [] }]);
    const [currentListingIndex, setCurrentListingIndex] = useState(0);

    const handleLikeListing = (isLike) => {
        axios.post(process.env.REACT_APP_API + '/listings/post-like', { listing: listings[currentListingIndex], isLike: isLike }, { withCredentials: true })
            .then((res) => {
                let nextListingIndex = currentListingIndex + 1 === listings.length ? currentListingIndex : currentListingIndex + 1
                setCurrentListingIndex(nextListingIndex);
            })
            .catch((err) => console.error(err))
    }

    useEffect(() => {
        axios.get(process.env.REACT_APP_API + '/listings/get-listing-batch', { withCredentials: true })
            .then((res) => {
                if (res.data.length === 0) return
                else setListings(res.data)
            })
            .catch((err) => console.log(err))
    }, [])

    console.log(listings)

    if (props.currentUserFirstName) {
        return (
            <div id="home-page">
                <div id="listing-swiper-container">
                    <div className="container">
                        <Carousel >
                            {listings[currentListingIndex].imageURLs.map((image, key) => {
                                return (
                                    <Carousel.Item>
                                        <div id={key} style={{ backgroundImage: 'url(' + image + ')' }} className="listing-images" />
                                    </Carousel.Item>
                                )
                            })}
                        </Carousel>
                        <img id="like-button" onClick={() => handleLikeListing(true)} alt="like button" src="https://img.icons8.com/fluency/80/000000/good-quality.png" />
                        <img id="dislike-button" onClick={() => handleLikeListing(false)} alt="dislike button" src="https://img.icons8.com/color/80/000000/poor-quality--v1.png" />
                    </div>
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