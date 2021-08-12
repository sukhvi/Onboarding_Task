import React, { Fragment, Component } from "react";
import { Button, Input } from "semantic-ui-react";
import SharedTable from "../shared/SharedTable/SharedTable";
import _ from "lodash";
import DeleteModal from "../shared/DeleteModal/DeleteModal";
import CreateEditModal from "../shared/CreateEditModal/CreateEditModal";
import SharedPagination from "../shared/SharedPagination/SharedPagination";

class Stores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stores: [],
      createEditModal: false,
      deleteStoreModal: false,
      deleteStoreId: "",
      editStoreId: "",
      mode: "",
      name: "",
      address: "",
      errors: "",
      column: null,
      direction: null,
      activePage: 0,
      noOfItemsVisible: 5,
      showFirstAndLastNav: true,
      showPreviousAndNextNav: true,
    };
  }

  componentDidMount() {
    this.fetchStores();
  }

  dispatch = (action) => {
    switch (action.type) {
      case "CHANGE_SORT":
        if (this.state.column === action.column) {
          return this.setState({
            ...this.state,
            stores: this.state.stores.slice().reverse(),
            direction:
              this.state.direction === "ascending" ? "descending" : "ascending",
          });
        }
        return this.setState({
          column: action.column,
          stores: _.sortBy(this.state.stores, [action.column]),
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
    const {
      stores,
      mode,
      name,
      address,
      noOfItemsVisible,
      activePage,
      errors,
    } = this.state;

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
        label: "Store Name",
        required: true,
        value: name,
        control: Input,
        placeholder: "Enter store name",
        onChange: this.handleDataChange,
      },
      {
        name: "address",
        label: "Store Address",
        required: true,
        control: Input,
        value: address,
        placeholder: "Enter store address",
        onChange: this.handleDataChange,
      },
    ];

    const handleEditClick = (item) => {
      this.setState({
        mode: "edit",
        name: item.name,
        address: item.address,
        editStoreId: item.id,
        createEditModal: true,
      });
    };

    const handleNewStore = (value) => {
      this.setState({
        mode: "create",
        createEditModal: value,
      });
    };

    const handleDeleteClick = (item) => {
      handleStoreDelete(true, item.id);
    };

    const handleStoreDelete = (modalState, id) => {
      this.setState({
        deleteStoreModal: modalState,
        deleteStoreId: id,
      });
    };

    const handleFormSubmit = (mode) => {
      const request = {};

      if (mode === "create") {
        request.method = "POST";
        request.endpoint = "stores/poststore";
        request.body = JSON.stringify({
          name: this.state.name,
          address: this.state.address,
        });
      } else if (mode === "edit") {
        request.method = "PUT";
        request.endpoint = `stores/putstore/${this.state.editStoreId}`;
        request.body = JSON.stringify({
          id: this.state.editStoreId,
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
          this.fetchStores();
          this.setState({ createEditModal: false });
        }
      });
    };

    const handleConfirmDelete = (id) => {
      const requestOptions = {
        method: "Delete",
      };
      fetch(`stores/deletestore/${id}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.fetchStores();
          this.setState({ deleteStoreModal: false });
        });
    };

    return (
      <Fragment>
        <Button primary onClick={() => handleNewStore(true)}>
          New Store
        </Button>

        <SharedTable
          headers={headers}
          content={stores.slice(
            activePage * noOfItemsVisible,
            (activePage + 1) * noOfItemsVisible
          )}
          dataColumn={dataColumn}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />

        <DeleteModal
          open={this.state.deleteStoreModal}
          onClose={handleStoreDelete}
          type="Store"
          onConfirm={handleConfirmDelete}
          id={this.state.deleteStoreId}
        />
        <CreateEditModal
          mode={mode}
          type="Store"
          formElements={formElements}
          open={this.state.createEditModal}
          onClose={handleNewStore}
          handleFormSubmit={handleFormSubmit}
          errors={errors}
        />

        <SharedPagination
          noOfItemsVisible={this.state.noOfItemsVisible}
          list={stores}
          handleActivePageChanged={this.handleActivePageChanged}
          handleNoOfVisibleItemChange={this.handleNoOfVisibleItemChange}
        />
      </Fragment>
    );
  }

  async fetchStores() {
    await fetch("stores/getstore")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          stores: data,
        })
      );
  }
}

export default Stores;
