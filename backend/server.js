require('dotenv').config();
const express = require('express');
const mysql = require('mysql2'); // Import the mysql2 package
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the dbConfig object
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// Check if the socket path is defined and add it to the configuration
if (process.env.DB_SOCKET_PATH) {
  dbConfig.socketPath = process.env.DB_SOCKET_PATH;
}

// Create the database connection
const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
