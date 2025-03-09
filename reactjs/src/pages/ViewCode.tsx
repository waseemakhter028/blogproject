import { useEffect, useState } from "react";
import { Button, Container, Image, Row, Col } from "react-bootstrap";
import { Buffer } from "buffer";
import parse from "html-react-parser";
import { useParams, useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark  } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Codes } from "../types";
import LoaderCmp from "../components/LoaderCmp";
import Notification from "../components/Notification";

const ViewCode = () => {
  const [loader, setLoader] = useState<boolean>(true);
  const [code, setCode] = useState<Codes>({
     id: 0,
      sub_category_id: 0,
      image: "",
      title: "",
      description: "",
      language: "",
      status: 0,
      createdAt: "",
      updatedAt: ""
  });
  const [error, setError] = useState<boolean>(false);
  const [theme] = useState(coldarkDark)
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      if (isNaN(Number(id))) navigate("/404");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/viewcode/${id}`
      );
      const data = await response.json();

      if (data.status === 404) {
        navigate("/404");
      } else {
        setCode(data.data);
      }
     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (err: any) {
    setError(true);
    setErrorMessage(err.message);
  } finally {
    setLoader(false);
  }
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !loader ? (
    <Container className="home-container">
        <Notification show={error} message={errorMessage} variant="danger" />
      <Row className="text-center">
        <Col xs={12}>
          <Image
            src={`data:image/jpeg;base64,${Buffer.from(
              code.image,
              "base64"
            ).toString("utf-8")}`}
            alt="Preview"
            className="img-fluid"
            style={{ width: "80%", height: "500px", borderRadius: "5px" }}
          />
        </Col>
        <Col xs={12} className="mt-3">
          <Button
            variant="primary btn-black"
            onClick={() => navigate("/")}
            style={{ width: "80px" }}
          >
            Back
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col xs={12} className="text-center">
          <h1 className="text-danger mt-5">{code.title}</h1>
        </Col>
        </Row>

      <Row className="mt-5">
        <Col xs={12} className="mt-3">
        <SyntaxHighlighter language={code.language} style={theme}  customStyle={{ fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif", fontSize: "18px", fontWeight: 600 }}
        codeTagProps={{ style: { fontFamily: "apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",  fontSize: "18px", fontWeight: 600 } }}  wrapLongLines={true} // ✅ Wraps long lines automatically
        wrapLines={true} // ✅ Ensures line breaks
        >
          {String(parse(code.description))}
        </SyntaxHighlighter>
        </Col>
      </Row>
    </Container>
  ) : (
    <LoaderCmp />
  );
};

export default ViewCode;
