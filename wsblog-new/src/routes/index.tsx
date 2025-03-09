import { createBrowserRouter } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import HomePage from "../pages/Home";
import ViewCodePage from "../pages/ViewCode";
import Error404 from "../components/Error404";
import ErrorPage from "../components/ErrorPage";


const router = createBrowserRouter([
  {
    path: "/",
    element:   <ErrorBoundary
    FallbackComponent={ErrorPage}
    onReset={() => window.location.reload()}
  ><HomePage /> </ErrorBoundary>,
  },
  {
    path: "/viewcode/:id",
    element:  <ErrorBoundary
    FallbackComponent={ErrorPage}
    onReset={() => window.location.reload()}
  ><ViewCodePage /> </ErrorBoundary>,
  },
  { path: "*", 
    element: <ErrorBoundary
    FallbackComponent={ErrorPage}
    onReset={() => window.location.reload()}
  ><Error404 /> </ErrorBoundary> 
}, 
]);

export default router;
