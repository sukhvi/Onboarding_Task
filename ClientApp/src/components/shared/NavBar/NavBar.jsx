import React, { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import "./NavBar.css";

const NavBar = () => {
  const [activeItem, setActiveItem] = useState("/");

  const navMenu = [
 
    { name: "Stores", to: "/stores" },
    { name: "Products", to: "/products" },
    { name: "Customers", to: "/" },
    { name: "Sales", to: "/sales" },
  ];

  const handleNavClick = ({ name }) => {
    setActiveItem(name);
  };

  return (
    <Fragment>
      <Menu inverted className="menu-bar">
        <span>React</span>

        {navMenu &&
          navMenu.map(({name, to}) => 
            <Menu.Item
              name={name}
              key={name}
              exact
              as={NavLink}
              to={to}
              active={activeItem === name}
              onClick={handleNavClick}
            />
          )}
      </Menu>
    </Fragment>
  );
};

export default NavBar;
