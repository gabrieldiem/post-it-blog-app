const express = require("express");
const app = express();

const SERVER_PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(SERVER_PORT, () => {
  console.log(`Example app listening on port ${port}`);
});
