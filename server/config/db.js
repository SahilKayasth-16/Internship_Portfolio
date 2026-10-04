const mongoose = require('mongoose');
const config = require('./env');

let listenersAttached = false;

/**
 * Attaches event listeners to the Mongoose connection instance.
 */
function attachListeners() {
  if (listenersAttached) {
    return;
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection lost. Connection state: disconnected.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection runtime error:', err.message);
  });

  listenersAttached = true;
}

/**
 * Connects to MongoDB using configured URI and options.
 * Lists existing collections in read-only mode and logs database metadata.
 *
 * @returns {Promise<void>}
 */
async function connectDB() {
  try {
    mongoose.set('strictQuery', true);
    attachListeners();

    const connectOptions = config.dbName ? { dbName: config.dbName } : {};
    await mongoose.connect(config.mongodbUri, connectOptions);

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
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    throw err;
  }
}

/**
 * Closes the active MongoDB connection.
 *
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = {
  connectDB,
  disconnectDB,
};

