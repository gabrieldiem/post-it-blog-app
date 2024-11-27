import express from "express";
import { logger, logAffected, logErrorMessageToConsole } from "../logger.js";
import { getPostInfo, createPost, getUserInfo } from "../db.js";
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


postRouter.post("/post", async (req, res) => {
  try {
    logger.info("Requested: POST /post");

    if(!(req.body)){
      throw Error("No body present in post request");
    }
    console.log(req.body);
    const username = req.body.username;
    const title = req.body.title;
    const content = req.body.content;

    if(!(title) || !(content) || !(username) || title.length == 0 || content.length == 0 || username.length == 0 ){
      throw Error("Invalid params: title, content or username");
    }

    const userInfo = await getUserInfo(username, db);
    if (userInfo.length == 0) {
      res.status(StatusCodes.NOT_FOUND).send("User does not exist");
      return;
    }

    await createPost(title, content, userInfo[0], db);

    res.send("OK");
  } catch (error) {
    const genericErrorMessage = "Failed post creation";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

export default postRouter;
