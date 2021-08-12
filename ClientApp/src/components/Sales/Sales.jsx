import React, { Fragment, Component } from "react";
import { Button, Select } from "semantic-ui-react";
import SharedTable from "../shared/SharedTable/SharedTable";
import _ from "lodash";
import moment from "moment";
import { DateInput } from "semantic-ui-calendar-react";

import DeleteModal from "../shared/DeleteModal/DeleteModal";
import CreateEditModal from "../shared/CreateEditModal/CreateEditModal";
import SharedPagination from "../shared/SharedPagination/SharedPagination";

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sales: [],
      createEditModal: false,
      deleteSaleModal: false,
      deleteSaleId: "",
      editSaleId: "",
      mode: "",
      dateSold: "",
      customersList: [],
      productsList: [],
      storesList: [],
      customerId: "",
      storeId: "",
      productId: "",
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
    this.fetchSales();
    this.loadLists();
  }

  dispatch = (action) => {
    switch (action.type) {
      case "CHANGE_SORT":
        if (this.state.column === action.column) {
          return this.setState({
            ...this.state,
            sales: this.state.sales.slice().reverse(),
            direction:
              this.state.direction === "ascending" ? "descending" : "ascending",
          });
        }
        return this.setState({
          column: action.column,
          sales: _.sortBy(this.state.sales, [action.column]),
          direction: "ascending",
        });
      default:
        throw new Error();
    }
  };

  handleDataChange = (e, { name, value }) => {
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
      sales,
      mode,
      dateSold,
      customersList,
      productsList,
      storesList,
      noOfItemsVisible,
      activePage,
    } = this.state;

    const headers = [
      {
        text: "Customer",
        width: "3",
        sorted:
          this.state.column === "customer.name" ? this.state.direction : null,
        onClick: () =>
          this.dispatch({ type: "CHANGE_SORT", column: "customer.name" }),
      },
      {
        text: "Product",
        width: "3",
        sorted:
          this.state.column === "product.name" ? this.state.direction : null,
        onClick: () =>
          this.dispatch({ type: "CHANGE_SORT", column: "product.name" }),
      },
      {
        text: "Store",
        width: "3",
        sorted:
          this.state.column === "store.name" ? this.state.direction : null,
        onClick: () =>
          this.dispatch({ type: "CHANGE_SORT", column: "store.name" }),
      },
      {
        text: "Date Sold",
        width: "3",
        sorted: this.state.column === "dateSold" ? this.state.direction : null,
        onClick: () =>
          this.dispatch({ type: "CHANGE_SORT", column: "dateSold" }),
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

    const dataColumn = "customer.name,product.name,store.name,dateSold";

    const formElements = [
      {
        label: "Date Sold",
        control: DateInput,
        name: "dateSold",
        id: "dateSold",
        placeholder: "Date Sold",
        dateFormat: "MMM-DD-YYYY",
        closable: true,
        value: dateSold,
        iconPosition: "left",
        onChange: this.handleDataChange,
      },
      {
        control: Select,
        label: "Customer",
        name: "customerId",
        options: customersList,
        placeholder: "Select Customer",
        onChange: this.handleDataChange,
      },
      {
        control: Select,
        label: "Product",
        name: "productId",
        options: productsList,
        placeholder: "Select Product",
        onChange: this.handleDataChange,
      },
      {
        control: Select,
        label: "Store",
        name: "storeId",
        options: storesList,
        placeholder: "Select Store",
        onChange: this.handleDataChange,
      },
    ];

    const handleEditClick = (item) => {
      this.setState({
        mode: "edit",
        name: item.name,
        address: item.address,
        editSaleId: item.id,
        createEditModal: true,
      });
    };

    const handleNewSale = (value) => {
      this.setState({
        mode: "create",
        createEditModal: value,
      });
    };

    const handleDeleteClick = (item) => {
      handleSaleDelete(true, item.id);
    };

    const handleSaleDelete = (modalState, id) => {
      this.setState({
        deleteSaleModal: modalState,
        deleteSaleId: id,
      });
    };

    const handleFormSubmit = (mode) => {
      const request = {};
      const id = this.state.editCustomerId;
      if (mode === "create") {
        request.method = "POST";
        request.endpoint = "sales/postsales";
        request.body = JSON.stringify({
          dateSold: moment.utc(this.state.dateSold),
          customerId: this.state.customerId,
          storeId: this.state.storeId,
          productId: this.state.productId,
        });
      } else if (mode === "edit") {
        request.method = "PUT";
        request.endpoint = `sales/putsales/${id}`;
        request.body = JSON.stringify({
          id: id,
          dateSold: moment.utc(this.state.dateSold),
          customerId: this.state.customerId,
          storeId: this.state.storeId,
          productId: this.state.productId,
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
      fetch(`sales/deletesales/${id}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.fetchSales();
          this.setState({ deleteSaleModal: false });
        });
    };

    return (
      <Fragment>
        <Button primary onClick={() => handleNewSale(true)}>
          New Sale
        </Button>

        <SharedTable
          headers={headers}
          content={sales.slice(
            activePage * noOfItemsVisible,
            (activePage + 1) * noOfItemsVisible
          )}
          dataColumn={dataColumn}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />

        <DeleteModal
          open={this.state.deleteSaleModal}
          onClose={handleSaleDelete}
          type="Sale"
          onConfirm={handleConfirmDelete}
          id={this.state.deleteSaleId}
        />
        <CreateEditModal
          mode={mode}
          type="Sale"
          formElements={formElements}
          open={this.state.createEditModal}
          onClose={handleNewSale}
          handleFormSubmit={handleFormSubmit}
          error={this.state.error}
        />

        <SharedPagination
          noOfItemsVisible={this.state.noOfItemsVisible}
          list={sales}
          handleActivePageChanged={this.handleActivePageChanged}
          handleNoOfVisibleItemChange={this.handleNoOfVisibleItemChange}
        />
      </Fragment>
    );
  }

  async fetchSales() {
    await fetch("sales/getsales")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((item) => {
          item.dateSold = moment.utc(item.dateSold).format("MMM-DD-YYYY");
        });
        this.setState({
          sales: data,
        });
      });
  }

  loadLists() {
    const endpoints = {
      customers: "customers/getcustomer",
      stores: "stores/getstore",
      products: "products/getproduct",
    };
    fetch(endpoints.customers)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((i) => {
          this.setState((prevState) => ({
            customersList: [
              ...prevState.customersList,
              { key: i.id, text: i.name, value: i.id },
            ],
          }));
        });
      });
    fetch(endpoints.products)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((i) => {
          this.setState((prevState) => ({
            productsList: [
              ...prevState.productsList,
              { key: i.id, text: i.name, value: i.id },
            ],
          }));
        });
      });
    fetch(endpoints.stores)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((i) => {
          this.setState((prevState) => ({
            storesList: [
              ...prevState.storesList,
              { key: i.id, text: i.name, value: i.id },
            ],
          }));
        });
      });
  }
}

export default Sales;
