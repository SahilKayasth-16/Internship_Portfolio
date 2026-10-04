const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const config = require('./config/env');
const corsOptions = require('./config/cors');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimiters');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// 1. Trust proxy in production behind reverse proxies
if (config.isProduction) {
  app.set('trust proxy', 1);
}

// 2. Security HTTP headers with cross-origin resource policy for uploaded assets
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 3. Cross-origin resource sharing
app.use(cors(corsOptions));

// 4. Request parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// 5. Cookie parsing
app.use(cookieParser());

// 6. Development logging
if (!config.isProduction) {
  app.use(morgan('dev'));
}

// 7. Rate limiting on API routes
app.use('/api', apiLimiter);

// 8. Application routes
app.use('/api', routes);

// 9. Root health/info endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio CMS API',
  });
});

// 10. Fallback 404 handler and central error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;

