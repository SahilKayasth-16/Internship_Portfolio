const mongoose = require('mongoose');
const config = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Maps Mongoose readyState numerical values to descriptive status labels.
 */
const DB_READY_STATE_MAP = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * Health check handler returning application and database connection diagnostics.
 */
const getHealth = asyncHandler(async (req, res) => {
  const readyState = mongoose.connection.readyState;
  const dbStatus = DB_READY_STATE_MAP[readyState] || 'disconnected';
  const dbName = mongoose.connection.name || 'unknown';

  res.status(200).json({
    success: true,
    status: 'ok',
    environment: config.nodeEnv,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      name: dbName,
    },
  });
});

module.exports = {
  getHealth,
};

