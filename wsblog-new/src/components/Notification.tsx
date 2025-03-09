import { Toast, ToastContainer } from "react-bootstrap";
import { NotificationProps } from "../types";

const ErrorToast: React.FC<NotificationProps> = ({
  show,
  message,
  variant,
}) => {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} delay={3000} autohide bg={variant}>
        <Toast.Body className="text-white">❌ {message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ErrorToast;
