import React from "react";
import { Container, Button, Card } from "react-bootstrap";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./Error404.css"; // Import custom styles

const Error404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="error-card text-center shadow-lg">
          <Card.Body>
            <ExclamationTriangleFill className="error-icon" />
            <h1 className="error-title">404</h1>
            <Card.Title className="text-danger fw-bold">
              Page Not Found
            </Card.Title>
            <Card.Text className="text-white">
              The page you're looking for doesn't exist or has been moved.
            </Card.Text>
            <Button
              variant="danger"
              className="mt-3"
              onClick={() => navigate("/")}
            >
              🏠 Go Home
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Error404;
