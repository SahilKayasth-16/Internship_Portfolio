require('dotenv').config();

// Validate required environment variables without logging secret values
if (!process.env.MONGODB_URI || process.env.MONGODB_URI.trim() === '') {
  console.error('Fatal configuration error: MONGODB_URI environment variable is missing or empty.');
  process.exit(1);
}

// Warn about optional environment variables
if (!process.env.DB_NAME || process.env.DB_NAME.trim() === '') {
  console.warn('Configuration warning: DB_NAME is not defined. Default "test" database will be used by MongoDB.');
}

if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.trim() === '') {
  console.warn('Configuration warning: RESEND_API_KEY is not defined. Email sending will be unavailable until it is set.');
}

const nodeEnv = process.env.NODE_ENV || 'development';
const rawClientUrls = process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000';
const parsedClientUrls = rawClientUrls
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const config = {
  nodeEnv,
  port: Number(process.env.PORT) || 5001,
  mongodbUri: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME || undefined,
  clientUrls: parsedClientUrls.length > 0 ? parsedClientUrls : ['http://localhost:3000'],
  resendApiKey: process.env.RESEND_API_KEY || '',
  rateLimitWindowMinutes: Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 300,
  isProduction: nodeEnv === 'production',
};

module.exports = Object.freeze(config);

