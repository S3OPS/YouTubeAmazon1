const winston = require('winston');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
        }
        return msg;
    })
);

// Create logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'info' : 'debug'),
    format: logFormat,
    defaultMeta: { service: 'printify-dropshipping' },
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: NODE_ENV === 'production' ? logFormat : consoleFormat,
        }),
    ],
});

// Add file transports in production
if (NODE_ENV === 'production') {
    logger.add(
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );
    logger.add(
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );
}

module.exports = logger;
