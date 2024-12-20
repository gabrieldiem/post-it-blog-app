import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";

import "./App.css";

import violetTheme from "./services/theme.js";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import PageNotFound404 from "./components/PageNotFound404.jsx";
import SignUp from "./components/SignUp.jsx";
import Account from "./components/Account.jsx";
import RequireLoggedIn from "./components/RequireLoggedIn.jsx";
import Post from "./components/Post.jsx";
import CreatePost from "./components/CreatePost.jsx";

import { CLIENT_URLS } from "./services/globals.js";

import { LOCAL_STORAGE_USER_KEY } from "./services/user.js";

const App = () => {
  const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const userState = { user: user, setUser: setUser };

  const _errorElement = (
    <Navbar userState={userState}>
      <PageNotFound404 />
    </Navbar>
  );

  const router = createBrowserRouter([
    {
      path: CLIENT_URLS.HOME,
      element: (
        <Navbar userState={userState}>
          <Home userState={userState} />
        </Navbar>
      ),
      errorElement: _errorElement,
    },
    {
      path: CLIENT_URLS.LOGIN,
      element: (
        <Navbar userState={userState}>
          <Login userState={userState} />
        </Navbar>
      ),
      errorElement: _errorElement,
    },
    {
      path: CLIENT_URLS.SIGNUP,
      element: (
        <Navbar userState={userState}>
          <SignUp userState={userState} />
        </Navbar>
      ),
      errorElement: _errorElement,
    },
    {
      path: CLIENT_URLS.ACCOUNT,
      element: (
        <Navbar userState={userState}>
          <RequireLoggedIn userState={userState}>
            <Account userState={userState} />
          </RequireLoggedIn>
        </Navbar>
      ),
      errorElement: _errorElement,
    },
    {
      path: `${CLIENT_URLS.POST}/:post_id`,
      element: (
        <Navbar userState={userState}>
          <Post userState={userState} />
        </Navbar>
      ),
      errorElement: _errorElement,
    },
    {
      path: `${CLIENT_URLS.CREATE_POST}`,
      element: (
        <Navbar userState={userState}>
          <RequireLoggedIn userState={userState}>
            <CreatePost userState={userState} />
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
