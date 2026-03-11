const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, errors } = format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(
    ({ level, message, timestamp, stack }) =>
      `${timestamp} [${level}]: ${stack || message}`
  )
);

const prodFormat = combine(timestamp(), errors({ stack: true }), format.json());

// Vercel has a read-only filesystem — skip file transports there
const isVercel = !!process.env.VERCEL;
const isProd = process.env.NODE_ENV === "production";

const logger = createLogger({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  format: isProd ? prodFormat : devFormat,
  transports: [
    new transports.Console(),
    ...(isProd && !isVercel
      ? [
          new transports.File({ filename: "logs/error.log", level: "error" }),
          new transports.File({ filename: "logs/combined.log" }),
        ]
      : []),
  ],
  exitOnError: false,
});

// Add http level for Morgan
logger.http = (message) => logger.log("http", message);

module.exports = logger;
