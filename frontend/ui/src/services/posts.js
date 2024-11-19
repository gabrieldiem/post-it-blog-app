import axios from "axios";
const BACKEND_SERVER_PORT = 3001;
const backendUrl = `http://localhost:${BACKEND_SERVER_PORT}`;


async function getPosts() {
  console.log("Fetching all posts");
  const allPostsUrl = `${backendUrl}/posts`;
  const postsRes = await axios.get(allPostsUrl);
  const postsFetched = postsRes.data;
  const parsedPosts = [];

  for(const post of postsFetched){
    const newPost = {
      id: post.post_id,
      title: post.post_title,
      content: post.post_content,
      attachment: post.post_attachment,
      creation_date: post.post_creation_date,
      last_change_date: post.post_last_change_date,
      user_id: post.user_id,
      username: post.user_name,
      comments: []
    }

    for(const comment of post.comments){
      const newComment = {
        id: comment.comment_id,
        content: comment.comment_content,
        creation_date: comment.comment_creation_date,
        last_change_date: comment.comment_last_change_date,
        user_id: comment.user_id,
        username: comment.user_name
      }

      newPost.comments.push(newComment);
    }

    parsedPosts.push(newPost);
  }

  return parsedPosts;
}

export default getPosts;
