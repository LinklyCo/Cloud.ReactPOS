import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import loadSpinner from "./loadSpinner.gif";

const ProgressModal = (props) => {
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <Modal show={props.txnInProgress} backdrop="static">
        <Modal.Header>
          <Modal.Title>Transaction in progress... </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img src={loadSpinner} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.sendCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProgressModal;
