import React, { Fragment } from "react";
import { Table, Button, Icon } from "semantic-ui-react";

const DynamicCells = (columnStrObject, ListObject) => {
  
  const keys = columnStrObject.split(",");
  return keys.map((key) => {
    const keyObj = key.split(".");
    if(keyObj.length>1) { 
      let [key1, value] = keyObj;
      return <Table.Cell key={key.toString()}>{ListObject[key1][value]}</Table.Cell>
    }
    else { return <Table.Cell key={key.toString()}>{ListObject[key.toString()]}</Table.Cell>}
  });
};

const SharedTable = ({ headers, content, dataColumn, handleEditClick, handleDeleteClick }) => {
  return (
    <Fragment>
      <Table celled striped sortable>
        <Table.Header>
          <Table.Row>
            {headers &&
              headers.map((header) => (
                <Table.HeaderCell key={header.text} {...header}>{header.text}</Table.HeaderCell>
              ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {content && content.length===0 && <Table.Row ><Table.Cell colSpan={headers.length} style={{textAlign:'center'}}>No item in this table.</Table.Cell></Table.Row>}
          {content &&
            content.map((item) => (
              <Table.Row key={item.id}>
                {DynamicCells(dataColumn, item)}
                <Table.Cell>
                <Button color="yellow" onClick={() => handleEditClick(item)}>
                    <Icon name="edit" />
                    Edit
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button color="red" onClick={() => handleDeleteClick(item)}>
                    <Icon name="delete" />
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Fragment>
  );
};

export default SharedTable;
