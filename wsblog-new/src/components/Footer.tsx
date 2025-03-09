import React from "react";
import Container from "react-bootstrap/Container";

const Footer: React.FC = () => {
  return (
    <footer className="footer text-light py-3 mt-5">
      <Container className="text-center">
        <hr className="border-secondary" />
        <p className="mb-0">Copyright © All rights reserved | WS Blog</p>
      </Container>
    </footer>
  );
};

export default Footer;
