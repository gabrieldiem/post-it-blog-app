import express from "express";
import { StatusCodes } from "http-status-codes";
import url from "url";
import { Image } from "../image.js";
import { logger, logErrorMessageToConsole } from "../logger.js";

const imageRouter = express.Router();

imageRouter.get("/img", async (req, res) => {
  try {
    logger.info("Requested: GET /img");

    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl ? parsedUrl.query : null;

    if (query == null) {
      throw Error("No param present in query string");
    }

    const imageId = query.id;
    if (!imageId) {
      throw Error("No image id present in query string");
    }

    const imageTarget = await Image.findById(imageId);

    if (!imageTarget) {
      res.status(StatusCodes.NOT_FOUND).send("Image not found");
      return;
    }
    console.log
    res.contentType(imageTarget.contentType);
    res.send(imageTarget.data);
  } catch (error) {
    const genericErrorMessage = "Failed to retrieve image";
    logErrorMessageToConsole(error, genericErrorMessage);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(genericErrorMessage);
  }
});

export default imageRouter;
