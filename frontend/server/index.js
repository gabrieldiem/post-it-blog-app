const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
const logger = require("./src/logger.js");

const app = express();

const PORT = process.env.PORT;
const TARGET_FOLDER_NAME = process.env.TARGET_FOLDER_NAME;
const ENTRY_POINT_HTML = "index.html";

const targetFolderDirPath = path.dirname(__dirname);

app.use(serveStatic(path.join(targetFolderDirPath, TARGET_FOLDER_NAME)));

app.get("*", (req, res) => {
  res.sendFile(path.join(targetFolderDirPath, TARGET_FOLDER_NAME, ENTRY_POINT_HTML));
});

app.listen(PORT, () => {
  logger.info(`Frontend server running on port ${PORT}, http://localhost:${PORT}`);
});
