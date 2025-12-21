const winston = require('winston');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log the request
    winston.info('Request:', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });

    // Log the response
    res.on('finish', () => {
        const duration = Date.now() - start;
        winston.info('Response:', {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        });
    });

    next();
};

module.exports = { requestLogger };