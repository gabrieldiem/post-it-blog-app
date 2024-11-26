import express from "express";
import serveStatic from "serve-static";
import path from "path";
import url, { fileURLToPath } from "url";
import { dirname } from "path";
import logger from "./src/logger.js";
import { ENTRY_POINT_HTML, TARGET_FOLDER_NAME } from "./src/constants.js";

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetFolderDirPath = dirname(__dirname);
const staticFolderPath = path.join(targetFolderDirPath, TARGET_FOLDER_NAME);

app.use(serveStatic(staticFolderPath));

app.get("*", (req, res) => {
  logger.info(`Requested: ${req.originalUrl}`);
  res.sendFile(path.join(targetFolderDirPath, TARGET_FOLDER_NAME, ENTRY_POINT_HTML));
});

app.listen(PORT, () => {
  logger.info(`Frontend server running on port ${PORT}, http://localhost:${PORT}`);
});
