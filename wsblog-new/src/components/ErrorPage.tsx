import React from "react";
import { FallbackProps } from "react-error-boundary";
import { Container, Button, Card } from "react-bootstrap";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import "./ErrorPage.css"; // Import custom styles

const ErrorPage: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="error-card text-center shadow-lg">
          <Card.Body>
            <ExclamationTriangleFill className="error-icon" />
            <Card.Title className="text-danger fw-bold">
              Oops! Something Went Wrong
            </Card.Title>
            <Card.Text className="text-white">
              {error.message ||
                "An unexpected error occurred. Please try again later."}
            </Card.Text>
            <Button
              variant="danger"
              onClick={resetErrorBoundary}
              className="mt-3"
            >
              🔄 Try Again
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ErrorPage;
