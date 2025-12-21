const winston = require('winston');

const errorHandler = (err, req, res, next) => {
    // Log the error
    winston.error('Error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    // Don't leak error details in production
    if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }

    // Development error response
    res.status(err.status || 500).json({
        success: false,
        message: err.message,
        stack: err.stack,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { errorHandler };