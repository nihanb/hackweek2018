import React from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';

const Header = () => (
  <Navbar inverse>
    <Navbar.Header>
      <Navbar.Brand>
        <span className="navbar-logo">Spotify</span>
        <span className="navbar-title">Spotty World</span>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav pullRight>
        <NavItem eventKey={1} href="#">Link</NavItem>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
