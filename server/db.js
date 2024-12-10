const mysql = require('mysql2');

// Create a connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Salmon123@',
  database: 'e-bid',
  port: 3306  // MySQL listens on port 3306
});

// Export the pool so it can be used elsewhere
module.exports = db;

