import express from "express";
import url from "url";
import { logger, logAffected, logErrorMessageToConsole } from "../logger.js";

import { StatusCodes } from "http-status-codes";

import { getUserInfo, createNewUser, updateUsername, deleteUser, deleteComment, getCommentInfo, getPostInfo, getUserInfoById, createNewComment, updateComment } from "../db.js";

import { getDb } from "../db.js";
const db = getDb();

const commentRouter = express.Router();

commentRouter.post("/comment", async (req, res) => {
  try {
    logger.info("Requested: POST /comment");

    if (!req.body) {
      throw Error("No body present in post request");
    }

    console.log(req.body);

    const content = req.body.content;
    if (content == null || content.length == 0) {
      logger.warn("Comment content is empty");
      res.status(StatusCodes.BAD_REQUEST).send("Comment content is empty");
      return;
    }

    const userId = req.body.user_id;
    console.log(userId);
    const userInfo = await getUserInfoById(userId, db);
    if (userInfo.length == 0) {
      logger.warn("User does not exist");
      res.status(StatusCodes.NOT_FOUND).send("User does not exist");
      return;
    }

    const postId = req.body.post_id;
    const postInfo = await getPostInfo(postId, db);
    if (postInfo.length == 0) {
      logger.warn("Post does not exist");
      res.status(StatusCodes.NOT_FOUND).send("Post does not exist");
      return;
    }

    await createNewComment(content, userId, postId, db);

    res.send("OK");
  } catch (error) {
    const genericErrorMessage = "Failed created comment";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

commentRouter.delete("/comment", async (req, res) => {
  try {
    logger.info("Requested: DELETE /comment");

    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl ? parsedUrl.query : null;

    if (query == null) {
      throw Error("No param present in query string");
    }

    const commentId = query.comment_id;
    if (!commentId || commentId < 0) {
      throw Error("Invalid comment id");
    }

    const username = query.username;
    const userInfo = await getUserInfo(username, db);

    if (userInfo.length == 0) {
      logger.warn("User does not exist");
      res.status(StatusCodes.NOT_FOUND).send("User does not exist");
      return;
    }

    await deleteComment(commentId, db);

    const commentInfoCheck = await getCommentInfo(commentId, db);

    if (commentInfoCheck.length != 0) {
      logger.warn("Error during comment deletion");
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error during comment deletion");
      return;
    }

    res.send("OK");
  } catch (error) {
    const genericErrorMessage = "Failed deleting comment";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

commentRouter.put("/comment", async (req, res) => {
  try {
    logger.info("Requested: PUT /comment");

    if (!req.body) {
      throw Error("No body present in post request");
    }

    console.log(req.body);

    const content = req.body.content;
    if (content == null || content.length == 0) {
      logger.warn("Comment content is empty");
      res.status(StatusCodes.BAD_REQUEST).send("Comment content is empty");
      return;
    }

    const userId = req.body.user_id;

    const userInfo = await getUserInfoById(userId, db);
    if (userInfo.length == 0) {
      logger.warn("User does not exist");
      res.status(StatusCodes.NOT_FOUND).send("User does not exist");
      return;
    }

    const commentId = req.body.comment_id;
    const commentInfo = await getCommentInfo(commentId, db);
    if (commentInfo.length == 0) {
      logger.warn("Comment does not exist");
      res.status(StatusCodes.NOT_FOUND).send("Comment does not exist");
      return;
    }

    if (commentInfo[0].comment_user_id !== userId) {
      logger.warn("User id does not match comment owner");
      res.status(StatusCodes.BAD_REQUEST).send("User id does not match comment owner");
      return;
    }

    await updateComment(content, userId, commentId, db);

    res.send("OK");
  } catch (error) {
    const genericErrorMessage = "Failed updating comment";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

export default commentRouter;
