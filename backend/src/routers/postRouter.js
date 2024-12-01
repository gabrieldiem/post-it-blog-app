import express from "express";
import { logger, logAffected, logErrorMessageToConsole } from "../logger.js";
import { getPostInfo, createPost, getUserInfo, deletePost, updatePost, updateAttachmentForPost, createNewComment } from "../db.js";
import { StatusCodes } from "http-status-codes";
import url from "url";
import { attachImage, deleteImage } from "../image.js";
import multer from "multer";

import { getDb } from "../db.js";
const db = getDb();

import { getPosts } from "../db.js";

const postRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

postRouter.get("/posts", async (req, res) => {
  try {
    logger.info("Requested: GET /posts");
    const posts = await getPosts(db);
    res.send(posts);
  } catch (error) {
    const genericErrorMessage = "Failed requesting posts";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

postRouter.get("/post", async (req, res) => {
  try {
    logger.info("Requested: GET /post");

    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl ? parsedUrl.query : null;

    if (query == null) {
      throw Error("No param present in query string");
    }

    const post = await getPostInfo(query.id, db);
    if (post.length == 0) {
      res.status(StatusCodes.NOT_FOUND).send("Post not found");
      return;
    }
    console.log(post);

    res.send(post);
  } catch (error) {
    const genericErrorMessage = "Failed requesting post from id";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

postRouter.post("/post", upload.single("image"), async (req, res) => {
  try {
    logger.info("Requested: POST /post");

    let file = null;
    if (req.file) {
      file = req.file;
    }

    const { title, content, username } = req.body;
    console.log(req.file);

    if (!title || !content || !username || title.length == 0 || content.length == 0 || username.length == 0) {
      throw Error("Invalid params: title, content or username");
    }

    const userInfo = await getUserInfo(username, db);
    if (userInfo.length == 0) {
      res.status(StatusCodes.NOT_FOUND).send("User does not exist");
      return;
    }

    const postId = await createPost(title, content, userInfo[0], db);
    console.log(postId);

    if (file) {
      const imageId = await attachImage(file, postId);
      await updateAttachmentForPost(postId, imageId, db);
    }

    res.send("OK");
  } catch (error) {
    const genericErrorMessage = "Failed post creation";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

postRouter.delete("/post", async (req, res) => {
  try {
    logger.info("Requested: DELETE /post");

    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl ? parsedUrl.query : null;

    if (query == null) {
      throw Error("No param present in query string");
    }

    const postId = query.post_id;
    if (!postId || postId < 0) {
      throw Error("Invalid post id");
    }

    const username = query.username;
    const userInfo = await getUserInfo(username, db);

    if (userInfo.length == 0) {
      logger.warn("User does not exist");
      res.status(StatusCodes.NOT_FOUND).send("User does not exist");
      return;
    }

    const postInfo = await getPostInfo(postId, db);
    if (postInfo.length == 0) {
      logger.warn("Id does not correspond to an existing post");
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Id does not correspond to an existing post");
      return;
    }

    const oldAttachment = postInfo.post_attachment;

    await deletePost(postId, db);

    const postInfoCheck = await getPostInfo(postId, db);

    if (postInfoCheck.length != 0) {
      logger.warn("Error during post deletion");
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error during post deletion");
      return;
    }

    console.log(oldAttachment);
    if (oldAttachment !== "NULL" && oldAttachment) {
      await deleteImage(oldAttachment);
    }

    res.send("OK");
  } catch (error) {
    const genericErrorMessage = "Failed deleting post";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

postRouter.put("/post", upload.single("image"), async (req, res) => {
  try {
    logger.info("Requested: PUT /post");

    let file = null;
    if (req.file) {
      file = req.file;
    }

    const { title, content, username, post_id } = req.body;
    const postId = post_id;
    console.log(title, content, username, post_id);

    if (!postId || !title || !content || !username || title.length == 0 || content.length == 0 || username.length == 0) {
      throw Error("Invalid params: title, content or username");
    }

    const userInfo = await getUserInfo(username, db);
    if (userInfo.length == 0) {
      res.status(StatusCodes.NOT_FOUND).send("User does not exist");
      return;
    }

    const postInfo = await getPostInfo(postId, db);
    if (postInfo.length == 0) {
      res.status(StatusCodes.NOT_FOUND).send("Post does not exist");
      return;
    }

    if (userInfo[0].user_id !== postInfo.user_id) {
      logger.warn("User id does not match post owner");
      res.status(StatusCodes.BAD_REQUEST).send("User id does not match post owner");
      return;
    }

    if (file) {
      const oldAttachment = postInfo.post_attachment;
      await deleteImage(oldAttachment);
      const newImageId = await attachImage(file, postId);
      await updateAttachmentForPost(postId, newImageId, db);
    } else {
      logger.error("nope");
    }

    await updatePost(postId, title, content, db);

    res.send("OK");
  } catch (error) {
    const genericErrorMessage = "Failed post update";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

export default postRouter;
