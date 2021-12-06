import React, { useState, useEffect } from 'react';
import "./Home.css"
import { Link, useHistory } from "react-router-dom";
import { Carousel, Modal, Button } from "react-bootstrap";
import axios from "axios";

function Home(props) {
    const [listings, setListings] = useState([{ imageURLs: [] }]);
    const [currentListingIndex, setCurrentListingIndex] = useState(0);
    const [likeCount, setLikeCount] = useState(1);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [buttonsEnabled, setButtonsEnabled] = useState(true);
    const [showNoListingsModal, setShowNoListingsModal] = useState(false);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [matchFirstListingPic, setMatchFirstListingPic] = useState('');
    const [matchSecondListingPic, setMatchSecondListingPic] = useState('');
    let history = useHistory();

    const handleLikeListing = (isLike) => {
        if (buttonsEnabled && (likeCount <= listings.length)) {
            setButtonsEnabled(false);

            axios.post(process.env.REACT_APP_API + '/listings/post-like', { listing: listings[currentListingIndex], isLike: isLike }, { withCredentials: true })
                .then(() => {
                    setLikeCount(likeCount + 1)

                    let nextListingIndex = currentListingIndex + 1 === listings.length ? currentListingIndex : currentListingIndex + 1 // don't allow listings to progress past last listing
                    setCurrentListingIndex(nextListingIndex);
                    setCurrentSlideIndex(0);
                    setButtonsEnabled(true);

                    checkForMatch();

                    if (nextListingIndex % 5 === 0) getListings();

                    if (likeCount === listings.length) {
                        setButtonsEnabled(false) // if the last listing has been reached, disable like/dislike butttons
                        handleShowNoListingsModal();
                    }
                })
                .catch((err) => console.error(err))
        }
        else if (likeCount === listings.length) {
            setButtonsEnabled(false) // if the last listing has been reached, disable like/dislike butttons
            handleShowNoListingsModal();
        }
    }

    const handleChangeSlide = (selectedIndex) => {
        setCurrentSlideIndex(selectedIndex);
    };

    const handleStartConversation = () => {
        axios.post(process.env.REACT_APP_API + '/messages/post-message', { listing: listings[currentListingIndex], conversationID: null }, { withCredentials: true })
            .then((res) => {
                history.push('/conversations/' + res.data._id)
            })
            .catch((err) => console.error(err))
    }

    const checkForMatch = () => {
        axios.post(process.env.REACT_APP_API + '/listings/is-a-match', { listing: listings[currentListingIndex] }, { withCredentials: true })
            .then((res) => {
                if (res.data.match) {
                    handleShowMatchModal()
                    axios.get(process.env.REACT_APP_API + '/listings/' + res.data.match.firstListing)
                        .then((res) => setMatchFirstListingPic(res.data.imageURLs[0]))
                        .catch((err) => console.error(err))

                    axios.get(process.env.REACT_APP_API + '/listings/' + res.data.match.secondListing)
                        .then((res) => setMatchSecondListingPic(res.data.imageURLs[0]))
                        .catch((err) => console.error(err))
                }
            })
            .catch((err) => console.error(err))
    }

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

                if (res.data.length === 0) {
                    handleShowNoListingsModal();
                    return;
                }
                else if (listings[0].imageURLs.length === 0) setListings(res.data) // if this is the first time retreiving lisitngs
                else setListings(listings => [...listings].concat(newListings)) // if adding more listings
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getListings();
    }, [])

    const handleCloseNoListingsModal = () => setShowNoListingsModal(false);
    const handleShowNoListingsModal = () => setShowNoListingsModal(true);

    const handleCloseMatchModal = () => setShowMatchModal(false);
    const handleShowMatchModal = () => setShowMatchModal(true);

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
                <Modal show={showNoListingsModal} onHide={handleCloseNoListingsModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sorry!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You've seen all available listings. Come back later when more are available.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseNoListingsModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showMatchModal}
                    onHide={handleCloseMatchModal}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header closeButton>
                        <Modal.Title>It's a match!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div id="match-listing-pics">
                            <div className="match-listing-pic" style={{ backgroundImage: 'url(' + matchFirstListingPic + ')' }} />
                            <div className="match-listing-pic" style={{ backgroundImage: 'url(' + matchSecondListingPic + ')' }} />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleStartConversation}>
                            Start Conversation With User
                        </Button>
                        <Button variant="secondary" onClick={handleCloseMatchModal}>
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