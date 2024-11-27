import express from "express";
import url from "url";
import { logger, logAffected, logErrorMessageToConsole } from "../logger.js"; 

import { StatusCodes } from "http-status-codes";

import { getUserInfo, createNewUser, updateUsername } from "../db.js";

import { getDb } from "../db.js";
const db = getDb();

const userRouter = express.Router();

userRouter.get("/user", async (req, res) => {
  try {
    logger.info("Requested: GET /user");

    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl ? parsedUrl.query : null;

    if (query == null) {
      throw Error("No param present in query string");
    }

    const userInfo = await getUserInfo(query.username, db);
    console.log(userInfo);

    if (userInfo.length == 0) {
      res.status(StatusCodes.NOT_FOUND).send("User not found");
      return;
    }

    res.send(userInfo);
  } catch (error) {
    const genericErrorMessage = "Failed requesting user info";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

userRouter.post("/user", async (req, res) => {
  try {
    logger.info("Requested: POST /user");

    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl ? parsedUrl.query : null;

    if (query == null) {
      throw Error("No param present in query string");
    }

    const userInfo = await getUserInfo(query.username, db);

    if (userInfo.length != 0) {
      res.status(StatusCodes.CONFLICT).send("User already exists");
      return;
    }

    await createNewUser(query.username, db);
    const newUserInfo = await getUserInfo(query.username, db);
    if (newUserInfo.length == 0) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error during using creation");
      return;
    }

    res.send(newUserInfo);
  } catch (error) {
    const genericErrorMessage = "Failed creating new user";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

userRouter.put("/user", async (req, res) => {
  try {
    logger.info("Requested: PUT /user");

    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl ? parsedUrl.query : null;

    if (query == null) {
      throw Error("No param present in query string");
    }

    const newUsername = query.new_username;
    const newUserInfo = await getUserInfo(newUsername, db);

    if (newUserInfo.length != 0) {
      logger.warn("User already exists");
      res.status(StatusCodes.CONFLICT).send("User already exists");
      return;
    }

    const oldUsername = query.old_username;
    const oldUserInfo = await getUserInfo(oldUsername, db);

    if (oldUserInfo.length == 0) {
      logger.warn("No user to change name to");
      res.status(StatusCodes.NOT_FOUND).send("No user to change name to");
      return;
    }

    await updateUsername(newUsername, oldUsername, db);

    const newUserInfoCheck = await getUserInfo(newUsername, db);

    const affected = newUserInfoCheck.length;
    logAffected(affected);
    if (affected == 0) {
      logger.warn("Error during using creation");
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error during using creation");
      return;
    }

    res.send(newUserInfoCheck);
  } catch (error) {
    const genericErrorMessage = "Failed creating new user";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

export default userRouter;
