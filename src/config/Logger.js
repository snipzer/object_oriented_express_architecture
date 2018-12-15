const winston = require('winston');

const logger = new winston.Logger();

logger.configure({
    level: 'debug',
    transports: [new winston.transports.Console()],
});

module.exports = logger;
