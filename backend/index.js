import express from "express";
import cors from "cors";
import logger from "./src/logger.js";
import initDB from "./src/init.js";

import { EXIT_SUCCESS, EXIT_FAILURE } from "./src/constants.js";
import getPosts from "./src/db.js";
const PORT = process.env.PORT;

const db = await initDB();
if (!db) {
  logger.fatal("Finishing execution");
  process.exit(EXIT_FAILURE);
}

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  logger.info("Requested: /");
  res.send("Hello World!");
});

app.get("/posts", async (req, res) => {
  logger.info("Requested: /posts");
  const posts = await getPosts(db);
  console.log(posts);
  res.send(posts);
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
