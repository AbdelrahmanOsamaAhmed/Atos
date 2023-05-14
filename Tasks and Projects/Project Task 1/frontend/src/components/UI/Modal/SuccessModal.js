import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const SuccessModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.message}</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant="success" onClick={props.onClose}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;
