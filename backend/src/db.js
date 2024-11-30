import { promisify } from "util";
import { MAX_USERNAME, MAX_POST_TITLE, MAX_CONTENT } from "./constants.js";
import { logger } from "./logger.js";
import initDB from "./init.js";

const db = await initDB();
if (!db) {
  logger.fatal("Finishing execution");
  process.exit(EXIT_FAILURE);
}

function getDb() {
  return db;
}

async function getCommentsFromPostId(postId, db) {
  const comments = await db.allP(`
    SELECT 
      comment.id AS comment_id,
      comment.content AS comment_content,
      comment.creation_date AS comment_creation_date,
      comment.last_change_date AS comment_last_change_date,
      user.id AS user_id,
      user.name AS user_name
    FROM 
      comment
    JOIN
      user ON comment.user_id = user.id
    WHERE
     comment.post_id = ${postId}
  `);

  return comments;
}

async function getPosts(db) {
  const posts = await db.allP(`
    SELECT 
      post.id AS post_id,
      post.title AS post_title,
      post.content AS post_content,
      post.attachment AS post_attachment,
      post.creation_date AS post_creation_date,
      post.last_change_date AS post_last_change_date,
      user.id AS user_id,
      user.name AS user_name
    FROM 
      post
    JOIN
      user ON post.user_id = user.id
    ORDER BY
      post_id DESC;
  `);

  for (const post of posts) {
    post.comments = await getCommentsFromPostId(post.post_id, db);
  }

  return posts;
}

async function getUserInfoById(userId, db) {
  const userInfo = await db.allP(`
    SELECT 
      user.id AS user_id,
      user.name AS user_name,
      user.creation_date AS user_creation_date
    FROM 
      user
    WHERE
      user.id = ${userId};
  `);

  return userInfo;
}

async function getUserInfo(username, db) {
  if (username == null || username.length == 0 || username.length > MAX_USERNAME) {
    throw Error("Invalid username");
  }

  const userInfo = await db.allP(`
    SELECT 
      user.id AS user_id,
      user.name AS user_name,
      user.creation_date AS user_creation_date
    FROM 
      user
    WHERE
      user.name = "${username}";
  `);

  return userInfo;
}

async function createNewUser(username, db) {
  if (username == null || username.length == 0 || username.length > MAX_USERNAME) {
    throw Error("Invalid username");
  }

  const currentTimeEpochMs = Date.now();

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    INSERT INTO user (name, creation_date, last_change_date) 
    VALUES (?, ?, ?)
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);

  await statement.runP(username, currentTimeEpochMs, currentTimeEpochMs);
  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function updateUsername(newUsername, oldUsername, db) {
  if (oldUsername == null || oldUsername.length == 0 || oldUsername.length > MAX_USERNAME) {
    throw Error("Invalid username");
  }

  if (newUsername == null || newUsername.length == 0 || newUsername.length > MAX_USERNAME) {
    throw Error("Invalid username");
  }

  const currentTimeEpochMs = Date.now();

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    UPDATE user
    SET name = ?, last_change_date = ?
    WHERE name = "${oldUsername}"
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);
  await statement.runP(newUsername, currentTimeEpochMs);
  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function getPostInfo(post_id, db) {
  if (post_id == null || post_id < 0) {
    throw Error("Invalid post id");
  }

  const postId = Number(post_id).toString();
  const postInfo = await db.allP(`
    SELECT 
      post.id AS post_id ,
      post.title AS post_title ,
      post.content AS post_content, 
      post.attachment AS post_attachment, 
      post.creation_date AS post_creation_date, 
      post.last_change_date AS post_last_change_date, 
      post.user_id AS post_user_id,
      user.id AS user_id,
      user.name AS user_name
    FROM 
      post
    JOIN
      user ON post.user_id = user.id
    WHERE
      post.id = ${postId}
  `);

  if (postInfo.length == 0) {
    return postInfo;
  }

  const post = postInfo[0];
  post.comments = await getCommentsFromPostId(post.post_id, db);

  return post;
}

async function createPost(title, content, userInfo, db) {
  console.log(userInfo);
  if (title.length > MAX_POST_TITLE) {
    throw Error("Title too long");
  }

  if (content.length > MAX_CONTENT) {
    throw Error("Content too long");
  }

  const currentTimeEpochMs = Date.now();

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    INSERT INTO post (title, content, attachment, creation_date, last_change_date, user_id) 
    VALUES (?, ?, ?, ?, ?, ?) 
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);

  await statement.runP(title, content, null, currentTimeEpochMs, currentTimeEpochMs, userInfo.user_id);
  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function deleteUser(username, db) {
  if (username == null || username.length == 0 || username.length > MAX_USERNAME) {
    throw Error("Invalid username");
  }

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    DELETE FROM user
    WHERE name = "${username}"
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);
  await statement.runP();
  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function deleteComment(comment_id, db) {
  const commentId = Number(comment_id).toString();
  if (commentId == null || commentId < 0) {
    throw Error("Invalid comment id");
  }

  await db.runP("BEGIN TRANSACTION");

  console.log(commentId);
  const statement = db.prepare(`
    DELETE FROM comment
    WHERE id = ${commentId};
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);
  await statement.runP();
  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function getCommentInfo(comment_id, db) {
  if (comment_id == null || comment_id < 0) {
    throw Error("Invalid comment id");
  }

  const commentId = Number(comment_id).toString();

  const commentInfo = await db.allP(`
    SELECT 
      comment.id AS comment_id,
      comment.post_id AS comment_post_id,
      comment.user_id AS comment_user_id
    FROM 
      comment
    WHERE
      comment.id = ${commentId};
  `);

  return commentInfo;
}

async function createNewComment(content, userId, postId, db) {
  if (content == null || content.length == 0) {
    throw Error("Invalid comment content");
  }
  if (userId == null || userId < 0) {
    throw Error("Invalid user id");
  }
  if (postId == null || postId < 0) {
    throw Error("Invalid post id");
  }

  const currentTimeEpochMs = Date.now();

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    INSERT INTO comment (content, creation_date, last_change_date, user_id, post_id) 
    VALUES (?, ?, ?, ?, ?)
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);

  await statement.runP(content, currentTimeEpochMs, currentTimeEpochMs, userId, postId);
  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function updateComment(content, userId, commentId, db) {
  if (content == null || content.length == 0) {
    throw Error("Invalid comment content");
  }
  if (userId == null || userId < 0) {
    throw Error("Invalid user id");
  }
  if (commentId == null || commentId < 0) {
    throw Error("Invalid comment id");
  }

  const currentTimeEpochMs = Date.now();

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    UPDATE comment
    SET content = ?, last_change_date = ?
    WHERE id = ?;
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);

  await statement.runP(content, currentTimeEpochMs, commentId);
  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function deletePost(post_id, db) {
  const postId = Number(post_id).toString();
  if (postId == null || postId < 0) {
    throw Error("Invalid post id");
  }

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    DELETE FROM post
    WHERE id = ${postId};
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);
  await statement.runP();
  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function updatePost(postId, title, content, db) {
  if (title.length > MAX_POST_TITLE) {
    throw Error("Title too long");
  }

  if (content.length > MAX_CONTENT) {
    throw Error("Content too long");
  }

  if(postId < 0){
    throw Error("Invalid post id");
  }

  const currentTimeEpochMs = Date.now();

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    UPDATE post
    SET title = ?, content = ?, last_change_date = ?
    WHERE id = ?;
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);

  await statement.runP(title, content, currentTimeEpochMs, postId);
  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}


export { getDb };
export { getPosts };
export { getUserInfo };
export { createNewUser };
export { updateUsername };
export { getPostInfo };
export { createPost };
export { deleteUser };
export { deleteComment };
export { getCommentInfo };
export { createNewComment };
export { getUserInfoById };
export { updateComment };
export { deletePost };
export { updatePost };
