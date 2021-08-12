import React from 'react';
import {  Grid, Select, Pagination } from "semantic-ui-react";

const noOfItemOptions = [
    {
      key: 0,
      text: "5 items",
      value: 5,
    },
    {
      key: 1,
      text: "10 items",
      value: 10,
    },
    {
      key: 2,
      text: "25 items",
      value: 25,
    },
  ];

const SharedPagination = ({noOfItemsVisible, handleNoOfVisibleItemChange,  list, handleActivePageChanged }) => {
    return (<Grid columns="2">
    <Grid.Row>
      <Grid.Column>
        <Select
          name="noOfItemsVisible"
          value={noOfItemsVisible}
          onChange={handleNoOfVisibleItemChange}
          options={noOfItemOptions}
        />
      </Grid.Column>
      <Grid.Column className="text-right">
        {Math.ceil(list.length / noOfItemsVisible) > 1 && (
          <Pagination
            boundaryRange={0}
            defaultActivePage={1}
            firstItem={null}
            lastItem={null}
            onPageChange={(event, data) =>
              handleActivePageChanged(event, data.activePage)
            }
            totalPages={Math.ceil(list.length / noOfItemsVisible)}
          />
        )}
      </Grid.Column>
    </Grid.Row>
  </Grid>);
}
 
export default SharedPagination;