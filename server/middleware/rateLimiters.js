const rateLimit = require('express-rate-limit');
const config = require('../config/env');

/**
 * Standard API rate limiter middleware.
 * Restricts client request frequency across configurable time windows.
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMinutes * 60 * 1000,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
    });
  },
});

module.exports = {
  apiLimiter,
};

