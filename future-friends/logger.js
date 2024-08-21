const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch'); // Optional, for remote logging

const logger = winston.createLogger({
  level: 'debug', // Set to 'debug' for more granular logs
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamps to logs
    winston.format.json() // Format logs as JSON
  ),
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      handleExceptions: true // Log unhandled exceptions to error.log
    }),
    new winston.transports.File({
      filename: 'combined.log',
      level: 'debug', // Log everything to combined.log
      handleExceptions: true
    })
  ]
});

// Log to console in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: 'info', // Log info and above to the console
    handleExceptions: true
  }));
}

// Optional: Add Elasticsearch transport for remote logging and real-time analysis
const esTransportOpts = {
  level: 'info',
  clientOpts: { node: 'http://localhost:9200' } // Adjust the node to your Elasticsearch setup
};
logger.add(new ElasticsearchTransport(esTransportOpts));

// Global error handling
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Optionally: process.exit(1); // Uncomment to exit on uncaught exceptions
});

module.exports = logger;