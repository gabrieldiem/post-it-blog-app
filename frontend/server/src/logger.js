global.LOG_LEVEL = process.env.LOG_LEVEL;
import pino from "pino";

const logger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true,
    },
  },
});

logger.level = global.LOG_LEVEL;

export default logger;
