const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

const errorFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const config = (file, method) => ({
  format: combine(
    label({ label: `${file}.js at ${method}` }),
    timestamp(),
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

module.exports = {
  errorLogger,
};
