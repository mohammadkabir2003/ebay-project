const express = require('express'); // Import Express
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const db = require('./db.js'); // Import the MySQL connection pool from db.js
const usersRouter = require('./routes/Users'); // Import the users router
const adminRouter = require('./routes/Admin'); // Import the admin router

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from React app
  credentials: true,
}));


app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(usersRouter);
app.use(adminRouter);

// Start the server
app.listen(3001, () => {
  console.log(`Server is running on port 3001`);
});

