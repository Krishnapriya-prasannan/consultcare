require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

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
// Create the database connection pool
const db = mysql.createPool(dbConfig);

// Connection testing
db.getConnection((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});




// POST /api/patients/signup
app.post('/api/patients/signup', (req, res) => {
  const { pat_name, pat_dob, pat_adr, pat_ph_no, pat_email, pat_sex } = req.body;

  const query = `CALL ManagePatientProfile(?, NULL, ?, ?, ?, ?, ?, ?, NULL)`;

  db.query(query, ['INS', pat_name, pat_dob, pat_adr, pat_ph_no, pat_email, pat_sex], (err, results) => {
      if (err) {
          if (err.sqlState === '45000') {
              return res.status(400).json({ error: err.message });  // Custom error from the procedure
          }
          return res.status(500).json({ error: 'Database error.' });
      }
      return res.status(201).json({ message: 'Patient signed up successfully.', data: results });
  });
});

// PUT /api/patients/update/:id
app.put('/api/patients/update/:id', (req, res) => {
  const pat_id = req.params.id;
  const { pat_name, pat_dob, pat_adr, pat_ph_no, pat_email, pat_sex, pat_reg_no } = req.body;

  const query = `CALL ManagePatientProfile(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, ['UPD', pat_id, pat_name, pat_dob, pat_adr, pat_ph_no, pat_email, pat_sex, pat_reg_no], (err, results) => {
      if (err) {
          if (err.sqlState === '45000') {
              return res.status(400).json({ error: err.message });  // Custom error from the procedure
          }
          return res.status(500).json({ error: 'Database error.' });
      }
      return res.status(200).json({ message: 'Patient updated successfully.', data: results });
  });
});
// DELETE /api/patients/delete/:id
app.delete('/api/patients/delete/:id', (req, res) => {
  const pat_id = req.params.id;

  const query = `CALL ManagePatientProfile(?, ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`;

  db.query(query, ['DEL', pat_id], (err, results) => {
      if (err) {
          if (err.sqlState === '45000') {
              return res.status(400).json({ error: err.message });  // Custom error from the procedure
          }
          return res.status(500).json({ error: 'Database error.' });
      }
      return res.status(200).json({ message: 'Patient deleted (locked) successfully.', data: results });
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
      CALL Retrieve_Pat_Details(?, @name, @dob, @address, @phone_no, @email, @registration_no, @sex,@status);
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
                 @registration_no AS regno, @sex AS sex,@status AS status;
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


app.get('/api/specialties', (req, res) => {
  db.query('CALL GetAllSpecialties()', (error, results) => {
    if (error) {
      console.error('Error fetching specialties: ', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // results is an array, with the first element being the result set
    const specialties = results[0].map(row => row.stf_speciality);
    res.json(specialties);
  });
});

app.get('/api/doctors/:specialty', (req, res) => {
  const specialtyName = req.params.specialty; // Get the specialty from the URL parameters

  db.query('CALL GetDoctorsBySpecialty(?)', [specialtyName], (error, results) => {
    if (error) {
      console.error('Error fetching doctors: ', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // results is an array, with the first element being the result set
    const doctors = results[0].map(row => ({
      id: row.stf_id,    // Assuming stf_id is the doctor's ID
      name: row.stf_name  // Assuming stf_name is the doctor's name
    }));

    res.json(doctors); // Respond with the list of doctors
  });
});

app.get('/api/available-dates/:doctorId', (req, res) => {
  const doctorId = req.params.doctorId;

  // Log the incoming request
  console.log('Fetching available dates for doctor ID:', doctorId);

  // Execute the stored procedure
  db.query('CALL GetNextSevenAvailableDates(?);', [doctorId], (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Access the results
      const availableDates = results[0]; // The first result set contains the available dates

      if (availableDates.length > 0) {
          res.json({ available_dates: availableDates });
      } else {
          res.json({ message: 'No available dates found.' });
      }
  });
});



app.get('/api/available-slots/:doctorId/:date', (req, res) => {
  const doctorId = parseInt(req.params.doctorId); // Get doctor ID from URL parameters
  const selectedDate = req.params.date; // Get selected date from URL parameters

  db.query('CALL ShowAvailableSlots(?, ?)', [doctorId, selectedDate], (error, results) => {
    if (error) {
      console.error('Error fetching available slots: ', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    // results is an array, with the first element being the result set
    const slots = results[0].map(row => ({
      id: row.tok_id,               // Token ID
      fromTime: row.tok_fr_time,    // Start time of the slot
      toTime: row.tok_to_time,      // End time of the slot
      tokenNumber: row.tok_no,       // Token number
      status: row.tok_status         // Token status
    }));

    res.json(slots); // Respond with the list of available slots
  });
});

app.post('/api/book-appointment', (req, res) => {
  const { doctorId, patientId, appointmentDate, timeSlot, tokenNumber } = req.body;

  // Log the incoming request
  console.log('Booking appointment for Doctor ID:', doctorId, 'Patient ID:', patientId);

  // Ensure required parameters are provided
  if (!doctorId || !patientId || !appointmentDate || !timeSlot || !tokenNumber) {
      return res.status(400).json({ error: 'All parameters are required' });
  }

  // Execute the stored procedure to book the appointment
  db.query('CALL BookAppointment(?, ?, ?, ?, ?);', 
      [doctorId, patientId, appointmentDate, timeSlot, tokenNumber], 
      (error, results) => {
          if (error) {
              console.error('Error executing query:', error);
              return res.status(500).json({ error: 'Internal Server Error' });
          }

          // If booking is successful, send a success response
          res.json({ message: 'Appointment booked successfully!' });
      }
  );
});

app.get('/api/appointments/:patientId', (req, res) => {
    const patientId = parseInt(req.params.patientId); // Get patient ID from URL parameters
    const flag = parseInt(req.query.flag); // Get flag from the query string

    // Check for valid flags: 1, 2, or 3
    if (isNaN(flag) || (flag < 1 || flag > 3)) {
        return res.status(400).json({ error: 'Invalid flag. Flag must be 1, 2, or 3.' });
    }

    // Call the stored procedure with the flag
    db.query('CALL GetAppointmentsByPatientId(?, ?)', [patientId, flag], (error, results) => {
        if (error) {
            console.error('Error fetching appointments:', error);
            return res.status(500).json({ error: 'Database query failed', message: error.message });
        }

        // Results is an array, with the first element being the result set
        const appointments = results[0].map(row => ({
            appointmentId: row.appointment_id,    // Appointment ID
            appointmentDate: row.appointment_date, // Appointment date
            timeSlot: row.time_slot,               // Time slot for the appointment
            doctorName: row.doctor_name,           // Name of the doctor
            tokenNumber: row.token_number,         // Token number
            remarks: row.remarks,                  // Remarks associated with the appointment
            status: row.status,                    // Status of the appointment
        }));

        res.json(appointments); // Respond with the list of appointments
    });
});



app.put('/api/appointments/update/:id', (req, res) => {
    const appointmentId = req.params.id; // Get the appointment ID from the URL parameters
    const { doctorId, patientId, appointmentDate, timeSlot, tokenNumber } = req.body; // Extract details from request body

    // Log the parameters
    console.log('Updating appointment with parameters:', {
        appointmentId,
        doctorId,
        patientId,
        appointmentDate,
        timeSlot,
        tokenNumber
    });

    // SQL query to call the stored procedure
    const query = `CALL UpdateAppointment(?, ?, ?, ?, ?, ?)`;

    // Execute the stored procedure with the provided parameters
    db.query(query, [appointmentId, doctorId, patientId, appointmentDate, timeSlot, tokenNumber], (err, results) => {
        if (err) {
            console.error('Error executing query:', err); // Log the error for debugging
            if (err.sqlState === '45000') {
                return res.status(400).json({ error: err.message }); // Return a 400 status for custom errors
            }
            return res.status(500).json({ error: 'Database error.' }); // Return a 500 status for general errors
        }
        return res.status(200).json({ message: 'Appointment updated successfully.', data: results }); // Success response
    });
});


// DELETE /api/appointments/cancel/:id
app.delete('/api/appointments/cancel/:appointmentId', (req, res) => {
    const appointmentId = parseInt(req.params.appointmentId);
    db.query('CALL CancelAppointment(?)', [appointmentId], (error, results) => {
        if (error) {
            console.error('Error cancelling appointment:', error);
            return res.status(500).json({ error: 'Database query failed', message: error.message });
        }
        res.json({ message: 'Appointment cancelled successfully' });
    });
});
  
app.post('/api/login/staff', async (req, res) => { // Add async here
    const { staffUsername, staffPassword } = req.body;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection:', err);
            return res.status(500).json({ message: 'Error connecting to database' });
        }

        const callProcedure = "CALL LoginStaff(?)";
        connection.query(callProcedure, [staffUsername], async (err) => { // Make this query callback async
            if (err) {
                console.error('Error executing procedure:', err);
                connection.release();
                return res.status(500).json({ message: 'Error logging in staff', error: err.message });
            }

            const outputQuery = "SELECT @staff_id AS staff_id, @staff_type AS staff_type, @message AS message";
            connection.query(outputQuery, async (err, results) => { // Make this query callback async
                connection.release();
                if (err) {
                    console.error('Error retrieving output parameters:', err);
                    return res.status(500).json({ message: 'Error retrieving staff details', error: err.message });
                }

                const staffIdResult = results[0].staff_id;
                const staffTypeResult = results[0].staff_type;
                const message = results[0].message;

                if (message === 'Account is locked.') {
                    return res.status(401).json({ message });
                }

                if (message === 'Invalid credentials.') {
                    return res.status(401).json({ message });
                }

                // Compare the password and check for status
                connection.query("SELECT stf_pswd, stf_status FROM Staff WHERE stf_username = ?", [staffUsername], async (err, results) => { // Make this query callback async
                    if (err) {
                        console.error('Error fetching staff details:', err);
                        return res.status(500).json({ message: 'Error fetching staff details' });
                    }

                    if (results.length === 0 || results[0].stf_status === 'L') {
                        return res.status(401).json({ message: 'Account is locked or does not exist.' });
                    }

                    const { stf_pswd: storedPassword } = results[0];
                    const passwordMatch = await bcrypt.compare(staffPassword, storedPassword); // This can now use await

                    if (passwordMatch) {
                        // If login is successful, send staff ID and type
                        res.status(200).json({ message: 'Login successful.', staffId: staffIdResult, staffType: staffTypeResult });
                    } else {
                        res.status(401).json({ message: 'Invalid credentials.' });
                    }
                });
            });
        });
    });
});


app.get('/api/medicines/:appointmentId', (req, res) => {
    const appointmentId = parseInt(req.params.appointmentId); // Get appointment ID from URL parameters

    if (isNaN(appointmentId)) {
        return res.status(400).json({ error: 'Invalid appointment ID' });
    }

    // Call the GetMedicinesByAppointmentId stored procedure
    db.query('CALL GetMedicinesByAppointmentId(?)', [appointmentId], (error, results) => {
        if (error) {
            console.error('Error fetching medicines:', error);
            return res.status(500).json({ error: 'Database query failed', message: error.message });
        }

        // Log the results from the stored procedure
        console.log('Results from stored procedure:', results);

        // results is an array, with the first element being the result set
        const medicines = results[0].map(row => ({
            medicineId: row.medicine_id,           // Use the correct field name
            appointmentId: appointmentId,            // Use appointmentId passed in
            medicineName: row.medicine_name,        // Use the correct field name
            dosage: row.dosage,                     // Use the correct field name
            duration: row.duration,                  // Use the correct field name
            instructions: row.instruction,           // Use the correct field name
            remarks: row.remarks                     // Use the correct field name
        }));

        console.log('Mapped medicines:', medicines); // Log the mapped medicines

        // Check if any medicines were found
        if (medicines.length === 0) {
            return res.status(404).json({ message: 'No medicines found for this appointment' });
        }

        res.json(medicines); // Respond with the list of medicines
    });
});


// Endpoint to get doctor details
app.get('/api/doctor/:id', (req, res) => {
    const doctorId = req.params.id;
    db.query('CALL GetDoctorDetails(?)', [doctorId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results[0][0]); // Return the first row from the result
    });
});

// Endpoint to update doctor password
app.post('/api/doctor/update-password', async (req, res) => {
    const { doctorId, newPassword } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.query('CALL UpdateDoctorPassword(?, ?)', [doctorId, hashedPassword], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ message: 'Password updated successfully' });
    });
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
