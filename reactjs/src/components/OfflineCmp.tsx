import React from "react";
import { Container, Button, Card } from "react-bootstrap";
import { WifiOff } from "react-bootstrap-icons";
import "./Error404.css"; // Import custom styles

const Offline: React.FC = () => {

  return (
    <div className="error-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="error-card text-center shadow-lg">
          <Card.Body>
            <WifiOff className="error-icon" />
            <h1 className="error-title">Offline</h1>
            <Card.Title className="text-danger fw-bold">
            You're Offline
            </Card.Title>
            <Card.Text className="text-white">
            It looks like you lost your internet connection. 
            </Card.Text>
            <Button
              variant="danger"
              className="mt-3"
            >
              Please check your network and try again.
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Offline;
