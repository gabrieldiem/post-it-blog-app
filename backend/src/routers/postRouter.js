import express from "express";
import { logger, logAffected, logErrorMessageToConsole } from "../logger.js";
import { StatusCodes } from "http-status-codes";

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

export default postRouter;
