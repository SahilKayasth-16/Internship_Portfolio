require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const {
  PORT = 5001,
  MONGODB_URI,
  DB_NAME,
  CLIENT_URLS = 'http://localhost:3000',
} = process.env;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is missing in server/.env');
  process.exit(1);
}

const app = express();

app.use(
  cors({
    origin: CLIENT_URLS.split(',').map((url) => url.trim()),
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    database: mongoose.connection.name,
  });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, DB_NAME ? { dbName: DB_NAME } : {});

    const dbName = mongoose.connection.name;
    console.log(`MongoDB connected, database: ${dbName}`);

    if (dbName === 'test') {
      console.warn('Connected to the default "test" database. Set DB_NAME in server/.env.');
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(
      'Collections:',
      collections.map((c) => c.name).join(', ') || '(none yet)'
    );

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

start();