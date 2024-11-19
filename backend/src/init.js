import fs from "fs";
import { promisify } from "util";
import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname } from "path";
import logger from "./logger.js";
import { DB_DIR_NAME, DB_PERSISTENCE_NAME, MAX_USERNAME, MAX_POST_TITLE } from "./constants.js";
const fsPromises = fs.promises;
const { OPEN_READWRITE, OPEN_CREATE, OPEN_FULLMUTEX } = sqlite3;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILEPATH = `${dirname(__dirname)}/${DB_DIR_NAME}/${DB_PERSISTENCE_NAME}`;

async function removeCorruptedDb() {
  try {
    await fsPromises.unlink(DB_FILEPATH);
    logger.warn("Removed corrupted DB file");
  } catch (err) {
    logger.error("Error while removing file");
    logger.error(err);
  }
}

function createDBConnection(dbExists) {
  if (!dbExists) {
    logger.info(`Creating new database ${DB_PERSISTENCE_NAME}`);
  } else {
    logger.info("Database already exists. Loading");
  }

  const db = new sqlite3.Database(DB_FILEPATH, OPEN_READWRITE | OPEN_CREATE | OPEN_FULLMUTEX);
  db.runP = promisify(db.run);

  return db;
}

async function createTables(db) {
  const userTableP = db.runP(`
    CREATE TABLE user (
      id INT PRIMARY KEY NOT NULL,
      name CHAR(${MAX_USERNAME}) NOT NULL,
      creation_date INT NOT NULL,
      last_change_date INT NOT NULL
  )`);

  const postTableP = db.runP(`CREATE TABLE post (
      id INT PRIMARY KEY NOT NULL, 
      title CHAR(${MAX_POST_TITLE}) NOT NULL, 
      content TEXT, 
      attachment TEXT, 
      creation_date INT NOT NULL, 
      last_change_date INT NOT NULL
  )`);

  const commentTableP = db.runP(`CREATE TABLE comment (
      id INT PRIMARY KEY NOT NULL, 
      content TEXT NOT NULL, 
      creation_date INT NOT NULL, 
      last_change_date INT NOT NULL
  )`);

  await Promise.all([userTableP, postTableP, commentTableP]);
}

async function fillWithDummyData(db) {}

async function initDB() {
  const dbExists = fs.existsSync(DB_FILEPATH);
  let db = createDBConnection(dbExists);

  if (!dbExists) {
    try {
      await createTables(db);
      await fillWithDummyData(db);
    } catch (err) {
      logger.error("Error while initializing DB");
      logger.error(err);
      await removeCorruptedDb();
      db = null;
    }
  }

  return db;
}

export default initDB;
