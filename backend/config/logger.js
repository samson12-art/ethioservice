const winston = require('winston');
const path = require('path');

const isServerless = !!process.env.VERCEL;

const transports = [];

if (!isServerless) {
  try {
    const logsDir = path.join(__dirname, '..', 'logs');
    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        maxsize: 5242880,
        maxFiles: 5
      }),
      new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        maxsize: 5242880,
        maxFiles: 5
      })
    );
  } catch (e) {
    // logs directory doesn't exist, skip file transports
  }
}

if (process.env.NODE_ENV !== 'production' || isServerless) {
  transports.push(new winston.transports.Console({
    format: isServerless
      ? winston.format.combine(winston.format.timestamp(), winston.format.json())
      : winston.format.combine(winston.format.colorize(), winston.format.simple())
  }));
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ethioservice-api' },
  transports
});

module.exports = logger;
