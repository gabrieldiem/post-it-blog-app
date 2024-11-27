import { promisify } from "util";
import { MAX_USERNAME } from "./constants.js";
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

async function getCommentFromPostId(postId, db) {
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
  `);

  for (const post of posts) {
    post.comments = await getCommentFromPostId(post.post_id, db);
  }

  return posts;
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

  if (post_id == null || post_id < 0) {
    throw Error("Invalid post id");
  }

  if (postInfo.length == 0) {
    return postInfo;
  }

  const post = postInfo[0];
  post.comments = await getCommentFromPostId(post.post_id, db);

  return post;
}

export { getDb };
export { getPosts };
export { getUserInfo };
export { createNewUser };
export { updateUsername };
export { getPostInfo };
