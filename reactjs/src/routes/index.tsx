import { createBrowserRouter } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import HomePage from "../pages/Home";
import ViewCodePage from "../pages/ViewCode";
import Error404 from "../components/Error404";
import ErrorPage from "../components/ErrorPage";
import ScrollToTop from "../components/ScrollToTop";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary
        FallbackComponent={ErrorPage}
        onReset={() => window.location.reload()}
      >
        <ScrollToTop />
        <HomePage />{" "}
      </ErrorBoundary>
    ),
  },
  {
    path: "/viewcode/:id",
    element: (
      <ErrorBoundary
        FallbackComponent={ErrorPage}
        onReset={() => window.location.reload()}
      >
        {" "}
        <ScrollToTop />
        <ViewCodePage />{" "}
      </ErrorBoundary>
    ),
  },
  {
    path: "*",
    element: (
      <ErrorBoundary
        FallbackComponent={ErrorPage}
        onReset={() => window.location.reload()}
      >
        {" "}
        <ScrollToTop />
        <Error404 />{" "}
      </ErrorBoundary>
    ),
  },
]);

export default router;
