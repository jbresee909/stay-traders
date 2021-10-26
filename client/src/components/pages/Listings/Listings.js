import React, { useEffect, useState } from "react"
import { Button, Modal, Form, Toast, Row } from "react-bootstrap";
import axios from "axios";
import imageCompression from 'browser-image-compression';
import "./Listings.css";

// import components
import ListingCard from "../../ListingCard/ListingCard";

function AddNewListing(props) {
    const [currentFormStep, setCurrentFormStep] = useState(1);
    const [previewSource, setPreviewSource] = useState([]);
    const [successMsg, setSuccessMsg] = useState();
    const [errMsg, setErrMsg] = useState();
    const [listingTitle, setListingTitle] = useState();
    const [listingDescription, setListingDescription] = useState();
    const [showMessageToast, setShowMessageToast] = useState(false);


    const handleFileInputChange = async (e) => {
        const files = e.target.files;

        // compress image
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }

        try {
            const compressedFiles = []
            for (let i = 0; i < files.length; i++) {
                compressedFiles.push(await imageCompression(files[i], options))
            }

            previewFiles(compressedFiles);

        } catch (error) {
            console.log(error);
        }

    };

    const previewFiles = (files) => {
        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.readAsDataURL(files[i]);
            reader.onloadend = () => {
                setPreviewSource(previewSource => [...previewSource, reader.result])
            };
        }


    };

    const handleSubmitListing = (e) => {
        e.preventDefault();

        if (!previewSource[0]) return;
        setCurrentFormStep(3); // set loader
        addListing();
    };

    const addListing = async () => {
        axios.post(process.env.REACT_APP_API + '/listings/add', { data: { images: previewSource, title: listingTitle, description: listingDescription } }, { withCredentials: true })
            .then(() => {
                // get updated listings
                props.getListings();

                // reset the form
                setCurrentFormStep(4);
                setSuccessMsg('Your listing has been posted!');
                setShowMessageToast(true);
                setPreviewSource([]);
                setCurrentFormStep(1);
                setListingTitle('');
                setListingDescription('');
            })
            .catch((err) => console.error(err))
    };

    const renderFormStep = (step) => {
        switch (step) {
            case 1:
                return (
                    <Form>
                        {previewSource.map((image, key) => {
                            return (<img
                                src={image}
                                id={key}
                                alt="chosen"
                                style={{ height: '300px' }}
                            />)
                        })}
                        <Form.Group controlId="formFileMultiple" className="mb-3">
                            <Form.Label>Select photos for your listing </Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                id="fileInput"
                                name="image"
                                onChange={handleFileInputChange}
                                accept="image/*"
                            />
                        </Form.Group>
                    </Form>
                )
            case 2:
                return (
                    <Form onSubmit={handleSubmitListing}>
                        <Form.Group className="mb-3" controlId="ControlInput1">
                            <Form.Label>Listing Title</Form.Label>
                            <Form.Control onChange={(e) => setListingTitle(e.target.value)} placeholder={listingTitle} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ControlTextarea1">
                            <Form.Label>Brief Description</Form.Label>
                            <Form.Control as="textarea" rows={3} onChange={(e) => setListingDescription(e.target.value)} placeHolder={listingDescription} />
                        </Form.Group>
                        <Button type="submit">Submit</Button>
                    </Form>
                )
            case 3:
                return (
                    <>
                        <h4>Submitting listing</h4>
                        <div className="loader"></div>
                    </>)
            default:
                setCurrentFormStep(2);
        }
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create New Listing
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {renderFormStep(currentFormStep)}
            </Modal.Body>
            <Modal.Footer>
                <Button style={currentFormStep === 1 || currentFormStep > 2 ? { display: "none" } : { display: "block" }}
                    onClick={() => {
                        let previousStep = currentFormStep - 1
                        setCurrentFormStep(previousStep);
                    }}>Previous</Button>
                <Button style={currentFormStep >= 2 ? { display: "none" } : { display: "block" }}
                    onClick={() => {
                        let nextStep = currentFormStep + 1
                        setCurrentFormStep(nextStep);
                    }}>Next</Button>
            </Modal.Footer>
            <Toast className="toast-message" onClose={() => setShowMessageToast(false)} show={showMessageToast} delay={3000} autohide style={successMsg ? { color: "green" } : { color: "red" }}>
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">{successMsg ? 'Congrats!' : 'On no!'}</strong>
                    <small>Just Now</small>
                </Toast.Header>
                <Toast.Body>{successMsg || errMsg}</Toast.Body>
            </Toast>
        </Modal>
    );
}

function Listings() {
    const [modalShow, setModalShow] = React.useState(false);
    const [listings, setListings] = useState([]);

    const getListings = () => {
        axios.get(process.env.REACT_APP_API + '/listings/users-listings', { withCredentials: true })
            .then((res) => {
                console.log(res.data);
                setListings(res.data)
            })
            .catch((err) => console.error(err))
    }

    useEffect(() => {
        getListings();
    }, [])

    return (
        <div className="container">
            <div id="listings-nav">
                <Button variant="success" onClick={() => setModalShow(true)} >
                    Add New Listing
                </Button>
            </div>
            <Row xs={1} md={2} className="g-4">
                {listings.map((listing) => {
                    return <ListingCard
                        key={listing._id}
                        listingID={listing._id}
                        title={listing.title}
                        description={listing.description}
                        imageURL={listing.imageURLs[0]}
                        getListings={getListings} />
                })}
            </Row>
            <AddNewListing
                show={modalShow}
                onHide={() => setModalShow(false)}
                getListings={getListings}
            />
        </div>
    );
}


export default Listings