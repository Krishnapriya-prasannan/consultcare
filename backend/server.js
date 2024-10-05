const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
  socketPath: '/var/run/mysqld/mysqld.sock',
  host: 'localhost',
  user: 'web', 
  password: 'mysql12', 
  database: 'ConsultcareDB' 
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  