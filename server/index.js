const express = require('express');
const cors = require('cors');
const db = require('./db.js'); // Import the MySQL connection pool from db.js
const usersRouter = require('./routes/Users');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'  // Allow requests from React app
}));



app.use(usersRouter);

// Start the server
app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

