import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";

import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import PageNotFound404 from "./components/PageNotFound404.jsx";
import violetTheme from "./services/theme.js";
import { useState } from "react";
import SignUp from "./components/SignUp.jsx";
import Account from "./components/Account.jsx";
import RequireLoggedIn from "./components/RequireLoggedIn.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const userState = { user: user, setUser: setUser };
  const _errorElement = (
    <Navbar userState={userState}>
      <PageNotFound404 />
    </Navbar>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Navbar userState={userState}>
          <Home userState={userState} />
        </Navbar>
      ),
      errorElement: _errorElement,
    },
    {
      path: "/login",
      element: (
        <Navbar userState={userState}>
          <Login userState={userState} />
        </Navbar>
      ),
      errorElement: _errorElement,
    },
    {
      path: "/signup",
      element: (
        <Navbar userState={userState}>
          <SignUp userState={userState} />
        </Navbar>
      ),
      errorElement: _errorElement,
    },
    {
      path: "/account",
      element: (
        <Navbar userState={userState}>
          <RequireLoggedIn userState={userState}>
            <Account userState={userState} />
          </RequireLoggedIn>
        </Navbar>
      ),
      errorElement: _errorElement,
    },
  ]);

  return (
    <>
      <ThemeProvider theme={violetTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
};

export default App;
