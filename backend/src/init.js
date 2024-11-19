import fs, { stat } from "fs";
import { promisify } from "util";
import sqlite3_ from "sqlite3";
import { fileURLToPath } from "url";
import { dirname } from "path";
import csvParser from "csvtojson";
import logger from "./logger.js";
import { DB_DIR_NAME, DB_PERSISTENCE_NAME, MAX_USERNAME, MAX_POST_TITLE } from "./constants.js";
import { promiseHooks } from "v8";
const fsPromises = fs.promises;
const { OPEN_READWRITE, OPEN_CREATE, OPEN_FULLMUTEX } = sqlite3_;
const sqlite3 = sqlite3_.verbose();

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
  db.allP = (sqlQuery) => {
    return new Promise((resolve, reject) => {
      db.all(sqlQuery, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  return db;
}

async function createTables(db) {
  const userTableP = db.runP(`
    CREATE TABLE user (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name CHAR(${MAX_USERNAME}) NOT NULL,
      creation_date INTEGER NOT NULL,
      last_change_date INTEGER NOT NULL
  )`);

  const postTableP = db.runP(`CREATE TABLE post (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
      title CHAR(${MAX_POST_TITLE}) NOT NULL, 
      content TEXT, 
      attachment TEXT, 
      creation_date INTEGER NOT NULL, 
      last_change_date INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES user(id)
  )`);

  const commentTableP = db.runP(`CREATE TABLE comment (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
      content TEXT NOT NULL, 
      creation_date INTEGER NOT NULL, 
      last_change_date INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      post_id INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES user(id),
      FOREIGN KEY(post_id) REFERENCES post(id)
  )`);

  await Promise.all([userTableP, postTableP, commentTableP]);
}

async function insertUsers(db) {
  const USERS_CSV_PATH = `${dirname(__dirname)}/${DB_DIR_NAME}/users.csv`;
  const usersArray = await csvParser().fromFile(USERS_CSV_PATH);

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    INSERT INTO user (name, creation_date, last_change_date) 
    VALUES (?, ?, ?)
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);

  for (const user of usersArray) {
    await statement.runP(user.username, user.creation_date, user.last_change_date);
  }

  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function insertPosts(db) {
  const POSTS_CSV_PATH = `${dirname(__dirname)}/${DB_DIR_NAME}/posts.csv`;
  const postsArray = await csvParser().fromFile(POSTS_CSV_PATH);

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    INSERT INTO post (title, content, attachment, creation_date, last_change_date, user_id) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);

  for (const post of postsArray) {
    await statement.runP(post.title, post.content, post.attachment, post.creation_date, post.last_change_date, post.user_id);
  }

  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function insertComments(db) {
  const COMMENTS_CSV_PATH = `${dirname(__dirname)}/${DB_DIR_NAME}/comments.csv`;
  const commentsArray = await csvParser().fromFile(COMMENTS_CSV_PATH);

  await db.runP("BEGIN TRANSACTION");

  const statement = db.prepare(`
    INSERT INTO comment (content, creation_date, last_change_date, user_id, post_id) 
    VALUES (?, ?, ?, ?, ?)
  `);

  statement.runP = promisify(statement.run);
  statement.finalizeP = promisify(statement.finalize);

  for (const comment of commentsArray) {
    await statement.runP(comment.content, comment.creation_date, comment.last_change_date, comment.user_id, comment.post_id);
  }

  await statement.finalizeP();
  await db.runP("END TRANSACTION");
}

async function fillWithDummyData(db) {
  await insertUsers(db);
  await insertPosts(db);
  await insertComments(db);
  logger.info("DB filled with dummy data");
}

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
