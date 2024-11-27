import express from "express";
import { logger, logAffected, logErrorMessageToConsole } from "../logger.js";
import { getPostInfo } from "../db.js";
import { StatusCodes } from "http-status-codes";
import url from "url";

import { getDb } from "../db.js";
const db = getDb();

import { getPosts } from "../db.js";

const postRouter = express.Router();

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

export default postRouter;
