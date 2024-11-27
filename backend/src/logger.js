global.LOG_LEVEL = process.env.LOG_LEVEL;
import pino from "pino";

const logger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: true,
    },
  },
});

logger.level = global.LOG_LEVEL;

function logAffected(rowsAffected) {
  const rowString = rowsAffected == 1 ? "row" : "rows";
  logger.info(`${rowsAffected} ${rowString} affected`);
}

function logErrorMessageToConsole(error, genericErrorMessage) {
  logger.error(genericErrorMessage);

  const errorMessage = error && error.message ? error.message : null;
  if (errorMessage) {
    logger.error(`Error message: ${errorMessage}`);
  } else {
    logger.error(error);
  }
}

export { logger };
export { logAffected };
export { logErrorMessageToConsole };
