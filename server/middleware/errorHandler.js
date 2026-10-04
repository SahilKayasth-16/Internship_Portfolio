const config = require('../config/env');
const ApiError = require('../utils/ApiError');

/**
 * 404 Not Found middleware.
 * Forwards an operational ApiError when a route does not exist.
 */
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Central Express error-handling middleware.
 * Formats errors into standardized JSON responses.
 */
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    if (err.errors && err.errors.length > 0) {
      errors = err.errors;
    }
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors || {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const duplicatedFields = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate field value: ${duplicatedFields}. Please use another value.`;
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request entity too large';
  } else {
    statusCode = err.statusCode || 500;
    message = config.isProduction ? 'Internal server error' : (err.message || 'Internal server error');
    if (!err.isOperational) {
      console.error('Unexpected error encountered:', err);
    }
  }

  const responseBody = {
    success: false,
    message,
  };

  if (errors) {
    responseBody.errors = errors;
  }

  if (!config.isProduction && err.stack) {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
}

module.exports = {
  notFound,
  errorHandler,
};

