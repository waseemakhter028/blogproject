import Button from "react-bootstrap/Button";
import { Buffer } from "buffer";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { CardProps } from "../types";

const CardComponent: React.FC<CardProps> = ({ image, title, link }) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm" style={{ width: "100%", height: "100%", borderRadius: "10px" }}>
      {/* Card Image */}
      <Card.Img
        variant="top"
        src={`data:image/jpeg;base64,${Buffer.from(image, "base64").toString("utf-8")}`}
        style={{ height: "200px", objectFit: "cover", borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
      />
      
      {/* Card Body */}
      <Card.Body className="d-flex flex-column justify-content-between">
        <Card.Title>{title}</Card.Title>
        <Button variant="primary btn-black mt-5" onClick={() => navigate(`/viewcode/${link}`)}>View</Button>
      </Card.Body>
    </Card>
  );
};

export default CardComponent;
