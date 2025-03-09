import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const Header: React.FC = () => {
  return (
    <Navbar className="justify-content-center">
      <Container>
        <Navbar.Brand className="text-light">WS Blog Code List</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
