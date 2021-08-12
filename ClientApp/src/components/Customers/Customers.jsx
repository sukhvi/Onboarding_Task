import React, { Fragment, Component } from "react";
import { Button, Input } from "semantic-ui-react";
import SharedTable from "../shared/SharedTable/SharedTable";
import _ from "lodash";
import DeleteModal from "../shared/DeleteModal/DeleteModal";
import CreateEditModal from "../shared/CreateEditModal/CreateEditModal";
import SharedPagination from "../shared/SharedPagination/SharedPagination";

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      createEditModal: false,
      deleteCustomerModal: false,
      deleteCustomerId: "",
      editCustomerId: "",
      mode: "",
      name: "",
      address: "",
      error: false,
      column: null,
      direction: null,
      activePage: 0,
      noOfItemsVisible: 5,
      showFirstAndLastNav: true,
      showPreviousAndNextNav: true,
    };
  }

  componentDidMount() {
    this.fetchCustomers();
  }

  dispatch = (action) => {
    switch (action.type) {
      case "CHANGE_SORT":
        if (this.state.column === action.column) {
          return this.setState({
            ...this.state,
            customers: this.state.customers.slice().reverse(),
            direction:
              this.state.direction === "ascending" ? "descending" : "ascending",
          });
        }
        return this.setState({
          column: action.column,
          customers: _.sortBy(this.state.customers, [action.column]),
          direction: "ascending",
        });
      default:
        throw new Error();
    }
  };

  handleDataChange = (event, { name, value }) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  };

  handleActivePageChanged = (event, activePage) => {
    this.setState({
      activePage: activePage - 1,
    });
  };

  handleNoOfVisibleItemChange = (e, { name, value }) => {
    this.setState({ noOfItemsVisible: value });
  };

  render() {
    const { customers, mode, name, address, noOfItemsVisible, activePage } =
      this.state;

    const headers = [
      {
        text: "Name",
        width: "6",
        sorted: this.state.column === "name" ? this.state.direction : null,
        onClick: () => this.dispatch({ type: "CHANGE_SORT", column: "name" }),
      },
      {
        text: "Address",
        width: "6",
        sorted: this.state.column === "address" ? this.state.direction : null,
        onClick: () =>
          this.dispatch({ type: "CHANGE_SORT", column: "address" }),
      },
      {
        text: "Actions",
        width: "2",
      },
      {
        text: "Actoins",
        width: "2",
      },
    ];

    const dataColumn = "name,address";

    const formElements = [
      {
        name: "name",
        label: "Name",
        control: Input,
        required: true,
        value: name,
        placeholder: "Enter customer name",
        onChange: this.handleDataChange,
      },
      {
        name: "address",
        label: "Address",
        control: Input,
        required: true,
        value: address,
        placeholder: "Enter customer address",
        onChange: this.handleDataChange,
      },
    ];

    const handleEditClick = (item) => {
      this.setState({
        mode: "edit",
        name: item.name,
        address: item.address,
        editCustomerId: item.id,
        createEditModal: true,
      });
    };

    const handleNewCustomer = (value) => {
      this.setState({
        mode: "create",
        createEditModal: value,
      });
    };

    const handleDeleteClick = (item) => {
      handleCustomerDelete(true, item.id);
    };

    const handleCustomerDelete = (modalState, id) => {
      this.setState({
        deleteCustomerModal: modalState,
        deleteCustomerId: id,
      });
    };

    const handleFormSubmit = (mode) => {
      const request = {};

      if (mode === "create") {
        request.method = "POST";
        request.endpoint = "customers/postcustomer";
        request.body = JSON.stringify({
          name: this.state.name,
          address: this.state.address,
        });
      } else if (mode === "edit") {
        request.method = "PUT";
        request.endpoint = `customers/putcustomer/${this.state.editCustomerId}`;
        request.body = JSON.stringify({
          id: this.state.editCustomerId,
          name: this.state.name,
          address: this.state.address,
        });
      }

      const requestOptions = {
        method: request.method,
        headers: { "Content-Type": "application/json" },
        body: request.body,
      };

      fetch(request.endpoint, requestOptions).then((response) => {
        if (!response.ok) {
          response
            .json()
            .then((data) => this.setState({ errors: data.errors }));
        } else {
          this.fetchCustomers();
          this.setState({ createEditModal: false });
        }
      });
    };

    const handleConfirmDelete = (id) => {
      const requestOptions = {
        method: "Delete",
      };
      fetch(`customers/deletecustomer/${id}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.fetchCustomers();
          this.setState({ deleteCustomerModal: false });
        });
    };

    return (
      <Fragment>
        <Button primary onClick={() => handleNewCustomer(true)}>
          New Customer
        </Button>

        <SharedTable
          headers={headers}
          content={customers.slice(
            activePage * noOfItemsVisible,
            (activePage + 1) * noOfItemsVisible
          )}
          dataColumn={dataColumn}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />

        <DeleteModal
          open={this.state.deleteCustomerModal}
          onClose={handleCustomerDelete}
          type="Customer"
          onConfirm={handleConfirmDelete}
          id={this.state.deleteCustomerId}
        />
        <CreateEditModal
          mode={mode}
          type="Customer"
          formElements={formElements}
          open={this.state.createEditModal}
          onClose={handleNewCustomer}
          handleFormSubmit={handleFormSubmit}
          error={this.state.error}
        />

        <SharedPagination
          noOfItemsVisible={this.state.noOfItemsVisible}
          list={customers}
          handleActivePageChanged={this.handleActivePageChanged}
          handleNoOfVisibleItemChange={this.handleNoOfVisibleItemChange}
        />
      </Fragment>
    );
  }

  async fetchCustomers() {
    await fetch("customers/getcustomer")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          customers: data,
        })
      );
  }
}

export default Customers;
