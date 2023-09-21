const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, errors } = format;

const fs = require("fs");
const path = require("path");

const errorFormat = printf(({ level, message, label, timestamp, stack }) => {
  return `${timestamp} [${label}] ${level}: ${message}\n${stack}`;
});

const config = (file, method) => ({
  format: combine(
    label({ label: `${file}.js at ${method}` }),
    timestamp(),
    errors({ stack: true }),
    errorFormat
  ),
  transports: [
    new transports.File({
      filename: `logs/${new Date().getTime()}-${file}.log`,
    }),
  ],
});

const errorLogger = (file, method) => {
  return createLogger(config(file, method));
};

const logRequestTime = (req, res, processingTime) => {
  const logger = createLogger({
    level: "info",
    format: format.json(),
    transports: [
      new transports.File({
        filename: `logs/time_logs/${new Date().getTime()}.log`,
      }),
    ],
  });

  logger.info({
    url: req.originalUrl,
    processingTime: `${processingTime}ms`,
    method: req.method,
    status: res.statusCode,
    headers: req.headers,
    body: req.body,
  });

  const filePath = path.join(
    __dirname,
    "..",
    "logs",
    "time_logs",
    "inbound.json"
  );
  const data = fs.readFileSync(filePath, "utf-8");
  let inboundData = JSON.parse(data);
  inboundData.push({
    url: req.originalUrl,
    processingTime: `${processingTime}`,
    measurement: "ms",
  });

  const jsonData = JSON.stringify(inboundData, null, 4); // Format JSON with 4 spaces indentation
  fs.writeFileSync(filePath, jsonData, "utf-8");
};

// Middleware to measure request processing time
function requestTimeLogger(req, res, next) {
  const startTime = Date.now(); // Record the start time

  res.on("finish", () => {
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    logRequestTime(req, res, processingTime);
  });

  next();
}

module.exports = {
  errorLogger,
  requestTimeLogger,
};
