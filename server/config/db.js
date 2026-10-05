const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows Node.js querySrv ECONNREFUSED with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore if not supported
}

let isConnecting = false;

const connectDB = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) return;
  isConnecting = true;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    isConnecting = false;
  } catch (error) {
    isConnecting = false;
    console.warn(`[MongoDB Warning] Could not connect to Atlas (${error.message}).`);
    console.warn('[MongoDB Notice] If this is an IP whitelist issue, add 0.0.0.0/0 in MongoDB Atlas -> Network Access.');
    
    // Auto retry connection in 10 seconds
    setTimeout(connectDB, 10000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[MongoDB] Disconnected. Attempting reconnection...');
  setTimeout(connectDB, 5000);
});

module.exports = connectDB;
