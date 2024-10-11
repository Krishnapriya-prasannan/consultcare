require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
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

app.post('/api/signup', (req, res) => {
  const { name, dob, address, phoneNo, email, sex } = req.body;

  const query = 'CALL AddPatient(?, ?, ?, ?, ?, ?, @patient_id);';
  
  db.query(query, [name, dob, address, phoneNo, email, sex], (err) => {
    if (err) {
      console.error('Error executing procedure:', err);
      return res.status(500).json({ message: 'Error adding patient', error: err.message });
    }

    res.status(201).json({ message: 'Patient added successfully' });
  });
});

// Patient Login API
app.post('/api/login/patient', (req, res) => {
  const { phoneNo, dob } = req.body;

  // Call the stored procedure to log in the patient
  const callProcedure = `
      CALL LoginUser(?, ?, @patient_id, @message);
  `;

  // Execute the procedure
  db.query(callProcedure, [phoneNo, dob], (err) => {
      if (err) {
          console.error("Error executing procedure:", err);
          return res.status(500).json({ error: 'Error executing procedure' });
      }

      // Retrieve the output parameters
      const outputQuery = `
          SELECT @patient_id AS patient_id, @message AS message;
      `;

      db.query(outputQuery, (err, results) => {
          if (err) {
              console.error("Error retrieving output parameters:", err);
              return res.status(500).json({ error: 'Error retrieving output parameters' });
          }

          // Check if results exist and retrieve output values
          if (results.length > 0) {
              const { patient_id, message } = results[0];
              
              // Check if login was successful
              if (patient_id) {
                  return res.status(200).json({ message: 'Login successful', patient_id });
              } else {
                  // Login failed
                  return res.status(401).json({ message }); // Return the error message from the procedure
              }
          } else {
              // No results found
              return res.status(404).json({ message: 'No results found' });
          }
      });
  });
});

// Patient Details API
app.get('/api/Retrievepatient/:id', (req, res) => {
  const patientId = req.params.id;

  // Prepare the SQL query to call the stored procedure
  const sql = `
      CALL Retrieve_Pat_Details(?, @name, @dob, @address, @phone_no, @email, @registration_no, @sex);
  `;

  // Execute the stored procedure
  db.query(sql, [patientId], (err) => {
      if (err) {
          console.error('Error executing stored procedure:', err);
          return res.status(500).json({ message: 'Error executing stored procedure' });
      }

      // Query to retrieve the output values from the stored procedure
      const outputSql = `
          SELECT @name AS name, @dob AS dob, @address AS address, 
                 @phone_no AS phone_no, @email AS email, 
                 @registration_no AS regno, @sex AS sex;
      `;

      // Fetch output values
      db.query(outputSql, (err, results) => {
          if (err) {
              console.error('Error retrieving output values:', err);
              return res.status(500).json({ message: 'Error retrieving patient details' });
          }

          if (results.length > 0) {
              return res.status(200).json(results[0]); // Return patient details
          } else {
              return res.status(404).json({ message: 'Patient not found' });
          }
      });
  });
});


// Staff Login API
app.post('/api/login/staff', (req, res) => {
  const { staffId, staffPassword } = req.body;

  const query = 'CALL LoginStaff(?, ?, @staff_id, @message); SELECT @staff_id AS staff_id, @message AS message;';
  
  db.query(query, [staffId, staffPassword], (err, results) => {
      if (err) {
          console.error('Error executing procedure:', err);
          return res.status(500).json({ message: 'Error logging in staff', error: err.message });
      }

      const staffIdResult = results[1][0].staff_id;
      const message = results[1][0].message;

      if (!staffIdResult) {
          return res.status(401).json({ message });
      }

      res.status(200).json({ message, staffId: staffIdResult });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
