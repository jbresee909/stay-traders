import React, { useState, useEffect } from 'react';
import "./Home.css"
import { Link } from "react-router-dom";
import { Carousel, Modal, Button } from "react-bootstrap";
import axios from "axios";

function Home(props) {
    const [listings, setListings] = useState([{ imageURLs: [] }]);
    const [currentListingIndex, setCurrentListingIndex] = useState(0);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [buttonsEnabled, setButtonsEnabled] = useState(true);
    const [show, setShow] = useState(false);

    const handleLikeListing = (isLike) => {
        if (buttonsEnabled && (currentListingIndex + 1 <= listings.length)) {
            setButtonsEnabled(false);
            console.log('like button clicked')

            axios.post(process.env.REACT_APP_API + '/listings/post-like', { listing: listings[currentListingIndex], isLike: isLike }, { withCredentials: true })
                .then(() => {
                    let nextListingIndex = currentListingIndex + 1 === listings.length ? currentListingIndex : currentListingIndex + 1 // don't allow listings to progress past last listing
                    setCurrentListingIndex(nextListingIndex);
                    setCurrentSlideIndex(0);
                    setButtonsEnabled(true);
                    if (currentListingIndex + 1 === listings.length) {
                        setButtonsEnabled(false) // if the last listing has been reached, disable like/dislike butttons
                        handleShow();
                    };

                    if (nextListingIndex % 5 === 0) getListings();
                })
                .catch((err) => console.error(err))
        }

    }

    const handleChangeSlide = (selectedIndex) => {
        setCurrentSlideIndex(selectedIndex);
    };

    const getListings = () => {
        axios.get(process.env.REACT_APP_API + '/listings/get-listing-batch', { withCredentials: true })
            .then((res) => {
                let currentListingIds = listings.map((listing) => listing._id)
                let newListings = [];

                if (newListings.length > 0) setButtonsEnabled(true);

                res.data.forEach((listing, index) => {
                    if (!currentListingIds.includes(listing._id)) {
                        newListings.push(res.data[index])
                    }
                })

                if (res.data.length === 0) return
                else if (listings[0].imageURLs.length === 0) setListings(res.data) // if this is the first time retreiving lisitngs
                else setListings(listings => [...listings].concat(newListings)) // if adding more listings
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getListings();
    }, [])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    if (props.currentUserFirstName) {
        return (
            <div id="home-page">
                <div id="listing-swiper-container">
                    <div className="container">
                        <Carousel activeIndex={currentSlideIndex} onSelect={handleChangeSlide}>
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
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sorry!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You've seen all available listings. Come back later when more are available.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
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