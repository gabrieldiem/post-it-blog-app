import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import PageNotFound404 from "./components/PageNotFound404.jsx";
import violetTheme from "./services/theme.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <PageNotFound404 />,
  },
]);

const App = () => {
  return (
    <>
      <ThemeProvider theme={violetTheme}>
        <Navbar />
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
};

export default App;
