import React, { useState } from "react"
import { Alert, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

function AddNewListing(props) {
    const [currentFormStep, setCurrentFormStep] = useState(1);
    const [fileInputState, setFileInputState] = useState();
    const [previewSource, setPreviewSource] = useState();
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState();
    const [errMsg, setErrMsg] = useState();
    const [listingTitle, setListingTitle] = useState();
    const [listingDescription, setListingDescription] = useState();


    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const handleSubmitListing = (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            addListing(reader.result);
        };
        reader.onerror = () => {
            console.error('AHHHHHHHH!!');
            setErrMsg('something went wrong!');
        };
    };

    const addListing = async (base64EncodedImage) => {
        axios.post(process.env.REACT_APP_API + '/listings/add', { data: { image: base64EncodedImage, title: listingTitle, description: listingDescription } }, { withCredentials: true })
            .then((res) => {
                console.log(res.data)
                setFileInputState('');
                setPreviewSource('');
                setSuccessMsg('Image uploaded successfully');
            })
            .catch((err) => console.error(err))
    };

    const renderFormStep = (step) => {
        switch (step) {
            case 1:
                return (
                    <Form>
                        <Alert variant="danger" style={!errMsg ? { display: "none" } : { display: 'block' }}>{errMsg}</Alert>
                        <Alert variant="success" style={!successMsg ? { display: "none" } : { display: 'block' }}>{successMsg} </Alert>
                        {previewSource && (
                            <img
                                src={previewSource}
                                alt="chosen"
                                style={{ height: '300px' }}
                            />
                        )}
                        <Form.Group controlId="formFileMultiple" className="mb-3">
                            <Form.Label>Multiple files input example</Form.Label>
                            <Form.Control
                                type="file"
                                multiple
                                id="fileInput"
                                name="image"
                                onChange={handleFileInputChange}
                                value={fileInputState} />
                        </Form.Group>
                    </Form>
                )
            case 2:
                return (
                    <Form onSubmit={handleSubmitListing}>
                        {listingTitle}
                        {listingDescription}
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Listing Title</Form.Label>
                            <Form.Control onChange={(e) => setListingTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Brief Description</Form.Label>
                            <Form.Control as="textarea" rows={3} onChange={(e) => setListingDescription(e.target.value)} />
                        </Form.Group>
                        <Button type="submit">Submit</Button>
                    </Form>
                )
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
                <Button onClick={() => {
                    let previousStep = currentFormStep - 1
                    setCurrentFormStep(previousStep);
                }}>Previous</Button>
                <Button onClick={() => {
                    let nextStep = currentFormStep + 1
                    setCurrentFormStep(nextStep);
                }}>Next</Button>
            </Modal.Footer>
        </Modal>
    );
}

function Listings() {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <>
            <Button variant="primary" onClick={() => setModalShow(true)}>
                Add New Listing
            </Button>

            <AddNewListing
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}


export default Listings