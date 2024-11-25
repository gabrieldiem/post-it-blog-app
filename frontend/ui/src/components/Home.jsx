import { useEffect, useState } from "react";
import PostPreview from "./PostPreview";
import getPosts from "../services/posts";
import "./Home.css";

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
      {posts.map((post, i) => {
        return <PostPreview key={i} post={post} userState={userState}/>;
      })}
    </>
  );
}

export default Home;
