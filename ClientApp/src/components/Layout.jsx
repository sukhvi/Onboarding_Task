import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./shared/NavBar/NavBar";
import Footer from "./shared/Footer/Footer";

const Layout = ({ children }) => {
  return (
    <Fragment>
      <NavBar />
      <Container fluid className="px-2 pb-4">{children}</Container>
      <Footer/>
    </Fragment>
  );
};

export default Layout;
