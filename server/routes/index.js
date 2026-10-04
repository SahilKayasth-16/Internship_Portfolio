const express = require('express');
const healthRoutes = require('./healthRoutes');

/**
 * Primary API router.
 * Central hub for mounting feature-specific sub-routers across the application.
 */
const router = express.Router();

// Health check endpoints
router.use('/health', healthRoutes);

module.exports = router;

