import React, { Fragment, Component } from "react";
import { Button, Input } from "semantic-ui-react";
import SharedTable from "../shared/SharedTable/SharedTable";
import _ from "lodash";
import DeleteModal from "../shared/DeleteModal/DeleteModal";
import CreateEditModal from "../shared/CreateEditModal/CreateEditModal";
import SharedPagination from "../shared/SharedPagination/SharedPagination";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      createEditModal: false,
      deleteProductModal: false,
      deleteProductId: "",
      editProductId: "",
      mode: "",
      name: "",
      price: 0,
      errors: false,
      column: null,
      direction: null,
      activePage: 0,
      noOfItemsVisible: 5,
      showFirstAndLastNav: true,
      showPreviousAndNextNav: true,
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  dispatch = (action) => {
    switch (action.type) {
      case "CHANGE_SORT":
        if (this.state.column === action.column) {
          return this.setState({
            ...this.state,
            products: this.state.products.slice().reverse(),
            direction:
              this.state.direction === "ascending" ? "descending" : "ascending",
          });
        }
        return this.setState({
          column: action.column,
          products: _.sortBy(this.state.products, [action.column]),
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
    const { products, mode, name, price, noOfItemsVisible, activePage } =
      this.state;

    const headers = [
      {
        text: "Name",
        width: "6",
        sorted: this.state.column === "name" ? this.state.direction : null,
        onClick: () => this.dispatch({ type: "CHANGE_SORT", column: "name" }),
      },
      {
        text: "Price",
        width: "6",
        sorted: this.state.column === "price" ? this.state.direction : null,
        onClick: () => this.dispatch({ type: "CHANGE_SORT", column: "price" }),
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

    const dataColumn = "name,price";

    const formElements = [
      {
        name: "name",
        label: "Name",
        required: true,
        control: Input,
        value: name,
        placeholder: "Enter product name",
        onChange: this.handleDataChange,
      },
      {
        name: "price",
        label: "Price",
        required: true,
        control: Input,
        value: price,
        placeholder: "Enter product price",
        onChange: this.handleDataChange,
      },
    ];

    const handleEditClick = (item) => {
      this.setState({
        mode: "edit",
        name: item.name,
        price: item.price,
        editProductId: item.id,
        createEditModal: true,
      });
    };

    const handleNewProduct = (value) => {
      this.setState({
        mode: "create",
        createEditModal: value,
      });
    };

    const handleDeleteClick = (item) => {
      handleProductDelete(true, item.id);
    };

    const handleProductDelete = (modalState, id) => {
      this.setState({
        deleteProductModal: modalState,
        deleteProductId: id,
      });
    };

    const handleFormSubmit = (mode) => {
      const request = {};

      if (mode === "create") {
        request.method = "POST";
        request.endpoint = "products/postproduct";
        debugger;
        const priceCheck = Number.parseFloat(this.state.price);
        if(isNaN(priceCheck)) {
          this.setState({ errors: ['Price can only be integer type'] })
          return false;
        }
        request.body = JSON.stringify({
          name: this.state.name,
          price: Number.parseFloat(this.state.price),
        });
      } else if (mode === "edit") {
        request.method = "PUT";
        request.endpoint = `products/putproduct/${this.state.editProductId}`;
        request.body = JSON.stringify({
          id: this.state.editProductId,
          name: this.state.name,
          price: Number.parseFloat(this.state.price),
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
          this.fetchProducts();
          this.setState({ createEditModal: false });
        }
      });
    };

    const handleConfirmDelete = (id) => {
      const requestOptions = {
        method: "Delete",
      };
      fetch(`products/deleteproduct/${id}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.fetchProducts();
          this.setState({ deleteProductModal: false });
        });
    };

    return (
      <Fragment>
        <Button primary onClick={() => handleNewProduct(true)}>
          New Product
        </Button>

        <SharedTable
          headers={headers}
          content={products.slice(
            activePage * noOfItemsVisible,
            (activePage + 1) * noOfItemsVisible
          )}
          dataColumn={dataColumn}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />

        <DeleteModal
          open={this.state.deleteProductModal}
          onClose={handleProductDelete}
          type="Product"
          onConfirm={handleConfirmDelete}
          id={this.state.deleteProductId}
        />
        <CreateEditModal
          mode={mode}
          type="Product"
          formElements={formElements}
          open={this.state.createEditModal}
          onClose={handleNewProduct}
          handleFormSubmit={handleFormSubmit}
          errors={this.state.errors}
        />

        <SharedPagination
          noOfItemsVisible={this.state.noOfItemsVisible}
          list={products}
          handleActivePageChanged={this.handleActivePageChanged}
          handleNoOfVisibleItemChange={this.handleNoOfVisibleItemChange}
        />
      </Fragment>
    );
  }

  async fetchProducts() {
    await fetch("products/getproduct")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          products: data,
        })
      );
  }
}

export default Products;
