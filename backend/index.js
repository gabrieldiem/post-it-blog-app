import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { logger } from "./src/logger.js";

import { EXIT_SUCCESS, EXIT_FAILURE } from "./src/constants.js";
import { getDb } from "./src/db.js";

const db = getDb();

import rootRouter from "./src/routers/rootRouter.js";
import userRouter from "./src/routers/userRouter.js";
import postRouter from "./src/routers/postRouter.js";

const PORT = process.env.BLOG_APP_BACKEND_PORT;

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(rootRouter);
app.use(userRouter);
app.use(postRouter);

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
