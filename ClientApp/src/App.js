import React, { Component } from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Stores from "./components/Stores/Stores";
import Sales from "./components/Sales/Sales";
import Products from "./components/Products/Products";
import Customers from "./components/Customers/Customers";

import "./custom.css";

export default class App extends Component {
  static displayName = App.name;

  render() {
    const routes = [
      { path: "/", component: Customers, exact: true },
      { path: "/stores", component: Stores },
      { path: "/sales", component: Sales },
      { path: "/products", component: Products },
    ];

    return (
      <Layout>
        {routes.map((route) => (
          <Route
            key={route.path}
            exact={route.exact}
            path={route.path}
            component={route.component}
          />
        ))}
      </Layout>
    );
  }
}
