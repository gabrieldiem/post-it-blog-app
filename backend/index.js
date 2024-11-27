import express from "express";
import url from "url";
import cors from "cors";
import logger from "./src/logger.js";
import initDB from "./src/init.js";

import { EXIT_SUCCESS, EXIT_FAILURE } from "./src/constants.js";
import { getPosts, getUserInfo, createNewUser, updateUsername } from "./src/db.js";
import { StatusCodes } from "http-status-codes";

const PORT = process.env.PORT;

const db = await initDB();
if (!db) {
  logger.fatal("Finishing execution");
  process.exit(EXIT_FAILURE);
}

const app = express();

app.use(cors());

function logAffected(rowsAffected) {
  const rowString = rowsAffected == 1 ? "row" : "rows";
  logger.info(`${rowsAffected} ${rowString} affected`);
}

function logErrorToConsole(error, genericErrorMessage) {
  logger.error(genericErrorMessage);

  const errorMessage = error && error.message ? error.message : null;
  if (errorMessage) {
    logger.error(`Error message: ${errorMessage}`);
  } else {
    logger.error(error);
  }
}

app.get("/", (req, res) => {
  try {
    logger.info("Requested: GET /");
    res.send("Hello World!");
  } catch (error) {
    const genericErrorMessage = "Failed requesting root path";
    logErrorToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

app.get("/posts", async (req, res) => {
  try {
    logger.info("Requested: GET /posts");
    const posts = await getPosts(db);
    res.send(posts);
  } catch (error) {
    const genericErrorMessage = "Failed requesting posts";
    logErrorToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

app.get("/user", async (req, res) => {
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
    logErrorToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

app.post("/user", async (req, res) => {
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
    logErrorToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

app.put("/user", async (req, res) => {
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
    logErrorToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

const server = app.listen(PORT, () => {
  logger.info(`Backend server running on port ${PORT}, http://localhost:${PORT}`);
});

/* Close DB at exit */

async function gracefulShutdown(signal, exitCode) {
  logger.info(`Received ${signal}. Closing server and database connection.`);
  server.close(async () => {
    logger.info("HTTP server closed.");

    try {
      db.close();
      logger.info("Database connection closed.");
      process.exit(exitCode);
    } catch (err) {
      logger.error("Error while closing database connection:", err);
      process.exit(EXIT_FAILURE);
    }
  });
}

process.on("SIGINT", async () => await gracefulShutdown("SIGINT", EXIT_SUCCESS));
process.on("SIGTERM", async () => await gracefulShutdown("SIGTERM", EXIT_SUCCESS));

process.on("uncaughtException", async (err) => {
  logger.error("Uncaught exception:");
  logger.error(err);
  await gracefulShutdown("uncaughtException", EXIT_FAILURE);
});
