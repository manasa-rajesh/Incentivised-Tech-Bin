let { createLogger, format, transports } = require('winston');
let { combine, timestamp, label, printf, prettyPrint } = format;
 
let logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'combined.log' }),
      new transports.File({
        filename: 'error.log',
        level: 'error'
      })
    ]
});

module.exports = logger;

/** Logging command

logger.log({
    level: 'info',
    message: 'What time is the testing at?'
});

**/