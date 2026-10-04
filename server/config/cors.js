const config = require('./env');
const ApiError = require('../utils/ApiError');

/**
 * CORS configuration options.
 * Allows non-browser requests (no Origin header) and whitelisted client URLs.
 */
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (e.g. mobile apps, curl, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    if (config.clientUrls.includes(origin)) {
      return callback(null, true);
    }

    return callback(new ApiError(403, 'Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;

