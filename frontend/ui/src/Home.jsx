import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import PostPreview from "./components/PostPreview";
import "./Home.css";
import getPosts from "./services/posts";

import TimeAgo from 'javascript-time-ago';
import es from 'javascript-time-ago/locale/es'
TimeAgo.addDefaultLocale(es)
const timeAgo = new TimeAgo('es-AR');

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async function () {
      setPosts(await getPosts());
    })();
  }, []);

  return (
    <>
      {posts
        ? posts.map((post, i) => {
            return <PostPreview key={i} post={post} timeAgo={timeAgo} />;
          })
        : null}
    </>
  );
}

export default Home;
