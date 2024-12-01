import { getMongoDb } from "./db.js";
import { logger } from "./logger.js";

const mongoDb = getMongoDb();

const imageSchema = new mongoDb.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  postId: { type: Number, required: true },
});

const Image = mongoDb.model("Image", imageSchema, "posts_images_collection");

async function attachImage(file, post_id) {
  if (!file) {
    logger.info("No image to attach");
    return;
  }
  console.log(file);
  const image = new Image({
    filename: file.originalname,
    contentType: file.mimetype,
    data: file.buffer,
    postId: post_id,
  });

  const savedImage = await image.save();
  logger.info("Image attached");
  console.log(savedImage._id);

  return savedImage._id;
}

async function deleteImage(attachment_id) {
  if (!attachment_id) {
    logger.info("No image to delete");
    return;
  }

  const res = await Image.findByIdAndDelete(attachment_id);

  if (!res) {
    throw Error(`Failed deleting old image with id ${attachment_id}`);
  }
}

export { Image };
export { attachImage };
export { deleteImage };
