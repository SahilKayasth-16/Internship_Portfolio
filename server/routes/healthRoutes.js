const express = require('express');
const { getHealth } = require('../controllers/healthController');

/**
 * Health check router.
 * Defines routing endpoints for application monitoring and diagnostics.
 */
const router = express.Router();

router.get('/', getHealth);

module.exports = router;

