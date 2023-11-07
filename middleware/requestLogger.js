const pino = require('pino');
const expressPino = require('express-pino-logger');

const logger = pino();
const expressLogger = expressPino({ logger });
logger.info('This is an info message');
logger.error('This is an error message');

// You can also include structured data in your log messages
logger.info({ user: 'Manoj', action: 'Login' }, 'User login');
function requestLogger(req, res, next) {
  expressLogger(req, res);
  next();
}

module.exports = requestLogger;
