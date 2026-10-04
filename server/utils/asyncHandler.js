/**
 * Express middleware helper to wrap asynchronous route handlers.
 * Catches unhandled promise rejections and forwards them to the Express next() handler.
 *
 * @param {Function} fn - Asynchronous Express middleware/controller function
 * @returns {Function} Express route handler with automatic promise rejection handling
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

