import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import PostPreview from "./PostPreview";
import getPosts from "../services/posts";

import { useNavigate } from "react-router-dom";

function Home({ userState }) {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  console.log(userState);
  useEffect(() => {
    async function fetchPosts() {
      setPosts(await getPosts());
    }
    fetchPosts();
  }, []);

  if (posts == null) {
    return null;
  }

  return (
    <>
      <Box className="home-container">
        <Button onClick={() => navigate("/account")}>acc</Button>
        {posts.map((post, i) => {
          return <PostPreview key={i} post={post} userState={userState} />;
        })}
      </Box>
    </>
  );
}

export default Home;
