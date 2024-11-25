import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PostPreview from "./PostPreview";
import getPosts from "../services/posts";

function Home({ userState }) {
  const [posts, setPosts] = useState([]);
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
        {posts.map((post, i) => {
          return <PostPreview key={i} post={post} userState={userState} />;
        })}
      </Box>
    </>
  );
}

export default Home;
