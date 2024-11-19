const express = require("express");

const PORT = process.env.PORT;
const logger = require("./src/logger.js");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  logger.info(`Backend server running on port ${PORT}, http://localhost:${PORT}`);
});
