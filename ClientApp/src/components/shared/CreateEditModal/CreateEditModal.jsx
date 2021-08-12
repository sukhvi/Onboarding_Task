import React, { Fragment } from "react";
import { Modal, Button, Form, Message } from "semantic-ui-react";

const DynamicFormElements = (formElements) => {
  return (
    formElements &&
    formElements.map((element, index) => (
      <Form.Field key={index} {...element} />
    ))
  );
};

const CreateEditModal = ({
  mode,
  type,
  formElements,
  open,
  onClose,
  handleFormSubmit,
  errors,
}) => {
  return (
    <Fragment>
      <Modal onClose={() => onClose(false)} open={open} size="tiny">
        <Modal.Header>
          {mode === "create" ? "Create" : "Edit"} {type}
        </Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            {errors &&  <Message negative>
              {Object.keys(errors).map((key,index) =>{
                return <p key={key}>{errors[key]}</p>
              })}
            </Message>
            
            }
            <Form>
              {DynamicFormElements && DynamicFormElements(formElements)}
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => onClose(false)}>
            Nope
          </Button>
          <Button
            content={mode === "create" ? "Create" : "Update"}
            labelPosition="right"
            icon="checkmark"
            positive
            type="submit"
            onClick={() => handleFormSubmit(mode)}
          />
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
};

export default CreateEditModal;
