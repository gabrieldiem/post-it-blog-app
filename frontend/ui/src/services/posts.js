import axios from "axios";

const BACKEND_SERVER_PORT = 8081;
const VITE_BASE_PATH_BACKEND_SERVER = import.meta.env.VITE_BASE_PATH_BACKEND_SERVER;
const backendUrl = `http://${VITE_BASE_PATH_BACKEND_SERVER}:${BACKEND_SERVER_PORT}`;

function parseCommentsFromPost(commentsFetched) {
  const parsedComments = [];

  for (const comment of commentsFetched) {
    const newComment = {
      id: comment.comment_id,
      content: comment.comment_content,
      creation_date: comment.comment_creation_date,
      last_change_date: comment.comment_last_change_date,
      user_id: comment.user_id,
      username: comment.user_name,
    };

    parsedComments.push(newComment);
  }

  return parsedComments;
}

function parsePost(post) {
  const newPost = {
    id: post.post_id,
    title: post.post_title,
    content: post.post_content,
    attachment: post.post_attachment,
    creation_date: post.post_creation_date,
    last_change_date: post.post_last_change_date,
    user_id: post.user_id,
    username: post.user_name,
    comments: [],
  };

  newPost.comments = parseCommentsFromPost(post.comments);
  return newPost;
}

function parsePosts(postsFetched) {
  const parsedPosts = [];

  for (const post of postsFetched) {
    parsedPosts.push(parsePost(post));
  }

  return parsedPosts;
}

async function getPosts() {
  console.log("Fetching all posts");
  const allPostsUrl = `${backendUrl}/posts`;
  const postsRes = await axios.get(allPostsUrl);
  const postsFetched = postsRes.data;
  return parsePosts(postsFetched);
}

async function getPostById(postId) {
  console.log(`Fetching post with id: ${postId}`);
  const postIdEncoded = encodeURIComponent(postId);
  const posrUrl = `${backendUrl}/post?id=${postIdEncoded}`;
  const postRes = await axios.get(posrUrl);
  const postFetched = postRes.data;
  return parsePost(postFetched);
}

async function createPost(title, content, username) {
  console.log("Creating post");
  const posrUrl = `${backendUrl}/post`;
  const postRes = await axios.post(posrUrl, {title: title, content: content, username: username});
  const res = postRes.data;
  console.log(res)
  return res == "OK";
} 

export { getPosts };
export { getPostById };
export { createPost };
