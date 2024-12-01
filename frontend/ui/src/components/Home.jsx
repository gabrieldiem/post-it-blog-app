import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import PostPreview from "./PostPreview";
import { getPosts } from "../services/posts";

import GenericDialog from "./GenericDialog";
import { useNavigate } from "react-router-dom";
import { CLIENT_URLS } from "../services/globals";

function Home({ userState }) {
  const [posts, setPosts] = useState([]);
  const [errorDialog, setErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const posts = await getPosts();
        setPosts(posts);
      } catch (error) {
        setErrorMessage("Error al cargar los posts");
        setErrorDialog(true);
      }
    }
    fetchPosts();
  }, []);

  if (posts == null) {
    return null;
  }

  return (
    <>
      {errorDialog ? (
        <GenericDialog
          text={errorMessage}
          reset={() => {
            setErrorDialog(false);
          }}
        />
      ) : null}
      <Box className="home-container">
        {posts.map((post, i) => {
          return <PostPreview key={i} post={post} userState={userState} />;
        })}
      </Box>
    </>
  );
}

export default Home;
