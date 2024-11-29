import axios from "axios";
import { BACKEND_URL } from "./globals";

async function createComment(content, post_id, user_id) {
  console.log("Creating comment");
  const commentUrl = `${BACKEND_URL}/comment`;
  const commentRes = await axios.post(commentUrl, {content: content, post_id: post_id, user_id:user_id});
  const res = commentRes.data;
  console.log(res)
  return res == "OK";
}

async function deleteComment(comment_id, username) {
  console.log("Deleting comment");
  const usernameEncoded = encodeURIComponent(username);
  const commentIdEncoded = encodeURIComponent(comment_id);
  const commentUrl = `${BACKEND_URL}/comment?username=${usernameEncoded}&comment_id=${commentIdEncoded}`;
  const commentRes = await axios.delete(commentUrl);
  
  const res = commentRes.data;
  console.log(res);
  return res == "OK";
}

async function updateComment(content, comment_id, user_id) {
  console.log("Updating comment");
  const commentUrl = `${BACKEND_URL}/comment`;
  const commentRes = await axios.put(commentUrl, {content: content, comment_id: comment_id, user_id:user_id});
  const res = commentRes.data;
  console.log(res)
  return res == "OK";
}

export { createComment };
export { deleteComment };
export { updateComment };
