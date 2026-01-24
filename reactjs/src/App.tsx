import { RouterProvider } from "react-router";
import router from "./routes";
import Header from "./components/Header";
import Footer from "./components/Footer";
import OfflinePage from "./components/OfflineCmp";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { CategoriesProvider } from "./context/CategoriesContext";


const App = () => {
  const isOnline = useOnlineStatus();
  return (
    <CategoriesProvider>
      <Header />
      {
        !isOnline ?
        <OfflinePage />
        :
        <RouterProvider router={router} />
      }
      
      <Footer />
    </CategoriesProvider>
  );
};

export default App;
