import React, { useState } from "react";
import "./ListingCard.css";
import { Col, Card, NavDropdown, Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function ListingCard(props) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [title, setTitle] = useState(props.title);
    const [description, setDescription] = useState(props.description);

    const handleCloseModal = () => setShowEditModal(false);
    const handleShowModal = () => setShowEditModal(true);


    const handleRemoveListing = (id) => {
        axios.post(process.env.REACT_APP_API + '/listings/delete', { id: id })
            .then((res) => {
                props.getListings();
            })
            .catch((err) => console.error(err))
    }

    const handleEditListing = (id) => {
        axios.post(process.env.REACT_APP_API + '/listings/edit', { id: id, title: title, description: description })
            .then((res) => {
                props.getListings();
                handleCloseModal();
            })
            .catch((err) => console.error(err))
    }


    return (
        <Col>
            <Card>
                <div style={{ backgroundImage: `url(${props.imageURLs[0]})` }} className="listing-image"> </div>
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>
                        {props.description}
                    </Card.Text>
                    <div className="listing-dropdown">
                        <NavDropdown title="Edit" id="nav-dropdown">
                            <NavDropdown.Item onClick={handleShowModal}>Edit Listing</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item style={{ color: "red" }} onClick={() => handleRemoveListing(props.listingID)}>Remove</NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </Card.Body>
            </Card>
            <Modal show={showEditModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Listing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlInput1">
                            <Form.Label>Listing Title</Form.Label>
                            <Form.Control placeholder={title} onChange={(e) => setTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ControlTextarea1">
                            <Form.Label>Brief Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeHolder={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEditListing(props.listingID)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Col>
    )
}

export default ListingCard;