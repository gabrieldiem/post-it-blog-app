import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import PostPreview from "./PostPreview";
import getPosts from "../services/posts";

import { useNavigate } from "react-router-dom";
import { CLIENT_URLS } from "../services/globals";

function Home({ userState }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      setPosts(await getPosts());
    }
    fetchPosts();
  }, []);

  if (posts == null) {
    return null;
  }

  const routTestingButtons = (
    <>
      <br/>
      {"     "}<Button onClick={() => navigate(CLIENT_URLS.HOME)} variant="contained">Home</Button> {"  "}
      <Button onClick={() => navigate(CLIENT_URLS.LOGIN)} variant="contained">Login</Button> {"  "}
      <Button onClick={() => navigate(CLIENT_URLS.SIGNUP)} variant="contained">Signup</Button>{"  "}
      <Button onClick={() => navigate(CLIENT_URLS.ACCOUNT)} variant="contained">Account</Button>{"  "}
    </>
  );

  return (
    <>
      {routTestingButtons}
      <Box className="home-container">
        {posts.map((post, i) => {
          return <PostPreview key={i} post={post} userState={userState} />;
        })}
      </Box>
    </>
  );
}

export default Home;
