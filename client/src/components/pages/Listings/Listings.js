import React, { useState } from "react"
import { Alert, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

function AddNewListing(props) {
    const [currentFormStep, setCurrentFormStep] = useState(1);
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');

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

    const handleSubmitFile = (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            uploadImage(reader.result);
        };
        reader.onerror = () => {
            console.error('AHHHHHHHH!!');
            setErrMsg('something went wrong!');
        };
    };

    const uploadImage = async (base64EncodedImage) => {
        axios.post(process.env.REACT_APP_API + '/listings/add', { data: base64EncodedImage }, { withCredentials: true })
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
                    <Form onSubmit={handleSubmitFile}>
                        <Alert>{errMsg} </Alert>
                        <Alert>{successMsg} </Alert>
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
                        <Button type="submit">Submit</Button>
                    </Form>
                )
            case 2:
                return (
                    <h1>Step 2</h1>
                )
            default:
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
                <Button onClick={props.onHide}>Close</Button>
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