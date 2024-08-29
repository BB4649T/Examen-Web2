// Header.jsx

import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home">Mon Application</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#patrimoine">Patrimoine</Nav.Link>
        <Nav.Link href="#possessions">Possessions</Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default Header;