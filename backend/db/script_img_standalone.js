import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// HERE GOES THE URI
const mongoURI = "";

const mongoDb = await connectMongoDB();

const imageSchema = new mongoDb.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  postId: { type: Number, required: true },
});

const Image = mongoDb.model("Image", imageSchema, "posts_images_collection");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function attachImage(file) {
  if (!file) {
    console.log("No image to attach");
    return;
  }
  console.log(file);
  const image = new Image({
    filename: file.originalname,
    contentType: file.mimetype,
    data: file.buffer,
    postId: -1,
  });

  const savedImage = await image.save();
  console.log("Image attached");
  console.log(savedImage._id);

  return savedImage._id;
}

async function connectMongoDB() {
  const _mongoDb = await mongoose.connect(mongoURI);
  console.log("MongoDB connected");
  return _mongoDb;
}

async function attachImagesFromFolder(folderName) {
  try {
    const folderPath = path.join(__dirname, folderName);

    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder not found: ${folderPath}`);
    }

    const files = fs.readdirSync(folderPath);

    for (const fileName of files) {
      const filePath = path.join(folderPath, fileName);
      if (fs.statSync(filePath).isDirectory() || !isSupportedFileType(filePath)) {
        console.warn(`Skipping: ${filePath}`);
        continue;
      }

      try {
        const fileData = fs.readFileSync(filePath);

        const file = {
          originalname: fileName,
          mimetype: getMimeType(filePath),
          buffer: fileData,
        };

        const imageId = await attachImage(file);
        console.log(`File: ${fileName}, Saved with ID: ${imageId}`);
      } catch (error) {
        console.error(`Error processing file: ${fileName}`, error);
      }
    }
  } catch (error) {
    console.error("Failed to process folder:", error);
    throw error;
  }
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".avif":
      return "image/avif";
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}

function isSupportedFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".gif", ".avif"].includes(ext);
}

const folderPath = "./posts_imgs/compressed/";
try {
  await attachImagesFromFolder(folderPath);
  console.log("All images processed successfully.");
} catch (err) {
  console.error("Failed to attach images from folder:", err);
}
