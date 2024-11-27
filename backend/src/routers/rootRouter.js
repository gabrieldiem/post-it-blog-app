import express from "express";
import { logger, logErrorMessageToConsole } from "../logger.js";
import { StatusCodes } from "http-status-codes";

import { getDb } from "../db.js";
const db = getDb();

const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  try {
    logger.info("Requested: GET /");
    res.send("Hello World!");
  } catch (error) {
    const genericErrorMessage = "Failed requesting root path";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

export default rootRouter;
