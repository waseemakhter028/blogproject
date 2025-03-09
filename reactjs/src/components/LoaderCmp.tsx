import { Image, Container } from "react-bootstrap";

const LoaderCmp = () => {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <Image src="/loader.gif" fluid alt="loader" />
    </Container>
  );
};

export default LoaderCmp;
