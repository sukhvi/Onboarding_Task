import React, { Fragment } from "react";
import { Modal, Button } from "semantic-ui-react";

const DeleteModal = ({ type ,open, onConfirm, onClose, id }) => {
  return (
    <Fragment>
      <Modal onClose={() => onClose(false)} open={open} size="tiny">
        <Modal.Header>Delete {type}</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>Are you sure?</p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => onClose(false)}>
            Nope
          </Button>
          <Button
            content="Delete"
            labelPosition="right"
            icon="delete"
            color="red"
            onClick={() => onConfirm(id)}
          />
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
};

export default DeleteModal;
