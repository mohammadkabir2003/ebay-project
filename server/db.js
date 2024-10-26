require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2');

// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,   // Allow requests to wait for a connection
  connectionLimit: 10,        // Limit the maximum number of connections
  queueLimit: 0               // No limit on queued connection requests
});

// Export the pool so it can be used elsewhere
module.exports = db;

