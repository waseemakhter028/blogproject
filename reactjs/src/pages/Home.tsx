import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Pagination from "react-js-pagination";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import LoaderCmp from "../components/LoaderCmp";
import Notification from "../components/Notification";
import { Category, Codes, PagesType } from "../types";
import { useCategories } from "../context/CategoriesContext";

const Home = () => {
  const [loader, setLoader] = useState<boolean>(true);
  const [contentLoader, setContentLoader] = useState<boolean>(false);
  const [codes, setCodes] = useState<Codes[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState<PagesType>({
    current_page: 1,
    per_page: 1,
    total: 1,
  });
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { categories: selectedSubCats, resetCategories } = useCategories();

  const getData = async (pageNumber = 1) => {
    window.scrollTo(0, 0);
    setContentLoader(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}?page=${pageNumber}`
      );
      const data = await response.json();
      setCategories(data.categories);
      setCodes(data.codes.data);
      setPages(data.codes);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(true);
      setErrorMessage(err.message);
    } finally {
      setLoader(false);
      setContentLoader(false);
    }
  };

  const filterData = (value: Codes[]) => {
    window.scrollTo(0, 0);
    setCodes(value);
    setPages({
      current_page: 1,
      per_page: 1,
      total: 1,
    });
    setContentLoader(false);
  };

  const clearFilter = () => {
    resetCategories();
    getData();
  };

  useEffect(() => {
    getData();

    return () => {
      resetCategories()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {}, [contentLoader]);

  return (
    <>
      {!loader ? (
        <Container className="home-container">
          <Notification show={error} message={errorMessage} variant="danger" />
          <Row>
            <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
              {selectedSubCats.length > 0 && (
                <div className="d-flex justify-content-end mb-3">
                  <Button
                    variant="primary"
                    className="btn-black"
                    id="btnfilter"
                    onClick={() => clearFilter()}
                  >
                    Clear Filter
                  </Button>
                </div>
              )}
              <Sidebar
                getData={getData}
                filterData={filterData}
                categories={categories}
                setContentLoader={setContentLoader}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={9} xl={9} xxl={9}>
              {!contentLoader ? (
                <Row className="mb-5">
                  {codes.length > 0 &&
                    codes.map((code) => (
                      <Col
                        key={code.id}
                        xs={12}
                        sm={12}
                        md={6}
                        lg={4}
                        xl={4}
                        xxl={4}
                        style={{ marginBottom: "20px" }}
                      >
                        <Card
                          image={code.image}
                          title={code.title}
                          link={code.id.toString()}
                        />
                      </Col>
                    ))}
                </Row>
              ) : (
                <LoaderCmp />
              )}

              {pages.total > 6 && !loader && !contentLoader ? (
                <div className="d-flex justify-content-center">
                  <nav aria-label="Page navigation example">
                    <Row>
                      <Col lg={12}>
                        <Pagination
                          activePage={pages.current_page}
                          itemsCountPerPage={pages.per_page}
                          totalItemsCount={pages.total}
                          pageRangeDisplayed={10}
                          linkClass="page-link"
                          itemClass="page-item"
                          activeClass="active"
                          activeLinkClass="active"
                          onChange={(pageNumber) => getData(pageNumber)}
                        />
                      </Col>
                    </Row>
                  </nav>
                </div>
              ) : null}
            </Col>
          </Row>
        </Container>
      ) : (
        <LoaderCmp />
      )}
    </>
  );
};

export default Home;
