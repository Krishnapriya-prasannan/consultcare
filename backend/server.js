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

            const outputQuery = "SELECT @staff_id AS staff_id, @staff_name as staff_name, @staff_type AS staff_type, @message AS message";
            connection.query(outputQuery, async (err, results) => { // Make this query callback async
                connection.release();
                if (err) {
                    console.error('Error retrieving output parameters:', err);
                    return res.status(500).json({ message: 'Error retrieving staff details', error: err.message });
                }

                const staffIdResult = results[0].staff_id;
                const staffNameResult = results[0].staff_name;
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
                        res.status(200).json({ message: 'Login successful.', staffId: staffIdResult,staffName : staffNameResult, staffType: staffTypeResult });
                    } else {
                        res.status(401).json({ message: 'Invalid credentials.' });
                    }
                });
            });
        });
    });
});


// Endpoint to get doctor details
app.get('/api/doctor/:id', (req, res) => {
  const doctorId = req.params.id;
  db.query('CALL GetDoctorDetails(?)', [doctorId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error', error: err });
      }
      console.log('Doctor details retrieved:', results); // Log the results
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

// Get Admin Details
app.get('/api/admin/:id', (req, res) => {
    const adminId = req.params.id;
    db.query('CALL GetAdminDetails(?)', [adminId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results[0][0]); // Return the first row from the result
    });
});

app.put('/api/admin/update/:id', async (req, res) => {
    const adminId = req.params.id;
    const {
      stf_name,
      stf_username,
      stf_sex,
      stf_speciality,
      stf_experience,
      stf_qualification,
      stf_email,
      stf_ph_no,
      stf_pswd, // Password to be updated
    } = req.body;
  
    // Initialize values array for the query
    const values = [
      stf_name,
      stf_username,
      stf_sex,
      stf_speciality,
      stf_experience,
      stf_qualification,
      stf_email,
      stf_ph_no,
    ];
  
    // Check if a new password is provided
    if (stf_pswd) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(stf_pswd, 10);
      values.push(hashedPassword); // Add the hashed password to the values array
    } else {
      // If no new password is provided, do not update the password field
      values.push(null); // Placeholder for password if not updating
    }
    values.push(adminId); // Add adminId at the end of values array
  
    // Update admin details, with condition to handle password
    const sql = `
      UPDATE Staff
      SET
        stf_name = ?,
        stf_username = ?,
        stf_sex = ?,
        stf_speciality = ?,
        stf_experience = ?,
        stf_qualification = ?,
        stf_email = ?,
        stf_ph_no = ?,
        stf_pswd = COALESCE(?, stf_pswd) -- Use COALESCE to keep existing password if not updating
      WHERE
        stf_id = ?`;
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error updating admin details:', err);
        return res.status(500).json({ message: 'Failed to update admin details' });
      }
      return res.status(200).json({ message: 'Admin details updated successfully' });
    });
  });




// API to get patients by doctor's ID
app.get('/api/patients/:staffId', (req, res) => {
    const staffId = req.params.staffId;
  
    db.query('CALL GetPatientsByDoctor(?)', [staffId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results[0]); // Results of the procedure
    });
  });

 // Endpoint to get today's appointments for a doctor
app.get('/api/dailyappointment/:staffId', (req, res) => {
  const staffId = req.params.staffId;

  db.query('CALL GetTodayAppointments(?)', [staffId], (error, results) => {
    if (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ error: 'Error fetching appointments' });
    }
    res.json(results[0]); // results[0] contains the result set
  });
});


 
// Route for applying leave
app.post('/api/leave', (req, res) => {
    const { hol_stf_id, hol_type, hol_date, hol_reason, hol_status } = req.body;

    // Input validation
    if (!hol_stf_id || !hol_type || !hol_date || !hol_reason) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // SQL query to insert a new leave request
    const sql = "INSERT INTO Holiday (hol_stf_id, hol_type, hol_date, hol_reason, hol_status) VALUES (?, ?, ?, ?, ?)";
    const values = [hol_stf_id, hol_type, hol_date, hol_reason, hol_status];

    db.query(sql, values, (error, results) => {
        if (error) {
            // Log the error to help identify the issue
            console.error("Database error:", error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
        res.status(201).json({ message: 'Leave applied successfully!', id: results.insertId });
    });
});


app.post('/api/updateLeaveStatus', (req, res) => {
  const { holId, hol_type, hol_date, hol_reason, hol_status } = req.body; // Ensure holId is extracted

  const query = 'UPDATE Holiday SET hol_type = ?, hol_date = ?, hol_reason = ?, hol_status = ? WHERE hol_id = ?';
  const values = [hol_type, hol_date, hol_reason, hol_status, holId]; // Include all values in the correct order

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error updating leave status:', error);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.affectedRows === 0) {
      // Handle the case where no rows were updated
      return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    return res.status(200).json({ success: true });
  });
});

  
  // Route for updating leave
app.put('/api/leave/:id', (req, res) => {
  const { id } = req.params; // Get the leave ID from the URL parameter
  const { hol_type, hol_date, hol_reason, hol_status } = req.body;


  const sql = 'UPDATE Holiday SET hol_type = ?, hol_date = ?, hol_reason = ?, hol_status = ? WHERE hol_id = ?';
  db.query(sql, [hol_type, hol_date, hol_reason, hol_status, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Leave not found');
    }
    res.status(200).send('Leave updated successfully!');
  });
});

  
  // API to delete leave
  app.delete('/api/leave/:id', (req, res) => {
    const leaveId = req.params.id;

    // SQL query to delete the leave application
    const sql = "DELETE FROM Holiday WHERE hol_id = ?";
    db.query(sql, [leaveId], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: 'An error occurred while processing your request.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Leave application not found.' });
        }
        res.status(204).send(); // No content
    });
});

  // API to get leave history
  app.get('/api/leave/:staff_id', (req, res) => {
    const { staff_id } = req.params;
    db.query('CALL GetLeaveHistory(?)', [staff_id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.status(200).json(results[0]); // results[0] contains the result set
    });
  });
  
// Get All Leaves with optional status filter
app.get('/api/leave', (req, res) => {
  const status = req.query.status; // Get the status from the query parameters
  let sql = 'CALL GetAllLeaves()'; // Default to getting all leaves

  // If a status is provided, modify the query
  if (status) {
    sql = 'CALL GetLeavesByStatus(?)'; // You should create this stored procedure to handle the filtering
  }

  db.query(sql, [status], (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results[0]);
  });
});


// Approve or Reject a Leave Application
app.put('/api/leaves/:id', (req, res) => {
  const { status } = req.body;
  const leaveId = req.params.id; // Get leave ID from URL

  db.query('CALL ApproveRejectLeave(?, ?)', [leaveId, status], (err) => {
      if (err) return res.status(500).send(err);
      res.send(`Leave application ${status === 'A' ? 'A' : 'R'}.`);
  });
});



app.get('/api/patient/:patientId/history', (req, res) => {
  const patientId = req.params.patientId;
  const query = 'CALL GetConsultationHistory(?)';

  connection.query(query, [patientId], (error, results) => {
      if (error) {
          return res.status(500).send('Error fetching history');
      }
      res.json(results[0]); // Return the consultation and medication history
  });
});


app.post('/api/addNewChart', async (req, res) => {
  const {
    patientRegNo,
    doctorId,
    appointmentDate,
    patientCondition,
    diagnosis,
    remarks,
    medicationEntries // expecting an array of medication entries
  } = req.body;

  console.log('Appointment Date:', appointmentDate);

  const query = `CALL AddNewChart(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    // Loop through the medication entries and call the stored procedure for each
    for (const med of medicationEntries) {
      const params = [
        patientRegNo,
        doctorId,
        appointmentDate,
        patientCondition,
        diagnosis,
        remarks,
        med.name,
        med.dosage,
        med.duration,
        med.instruction,
        med.remarks
      ];

      await new Promise((resolve, reject) => {
        db.query(query, params, (error, results) => {
          if (error) {
            console.error('Error executing query:', error);
            return reject(error);
          }
          resolve(results);
        });
      });
    }
    res.status(200).send('Charts successfully saved!');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add this to your server.js or appropriate routes file
app.get('/api/patientHistory/:regNo', (req, res) => {
  const { regNo } = req.params;

  const query = `
    SELECT 
        c.cons_id, c.cons_pat_condition, c.cons_diagnosis, c.cons_remarks, 
        c.cons_appt_id, c.cons_stf_id,
        a.appt_date,  -- Appointment date
        s.stf_name,   -- Staff name
        m.med_name, m.med_dosage, m.med_duration, m.med_instruction, m.med_remarks
    FROM Consultation c
    LEFT JOIN Medication m ON c.cons_id = m.med_cons_id
    LEFT JOIN Appointment a ON c.cons_appt_id = a.appt_id  -- Join with the Appointment table
    LEFT JOIN Staff s ON c.cons_stf_id = s.stf_id  -- Join with the Staff table
    WHERE c.cons_pat_id = (SELECT pat_id FROM Patient WHERE pat_reg_no = ?)
      AND a.appt_status = 'F'  -- Only include full day appointments
  `;

  db.query(query, [regNo], (error, results) => {
      if (error) {
          console.error('Error fetching patient history:', error);
          return res.status(500).send('Internal Server Error');
      }
      res.json(results);
  });
});


app.get('/api/patientsId/:regNo', (req, res) => {
  const regNo = req.query.regNo;
  // Query the database to find the patient ID based on regNo
  // Example query
  connection.query('SELECT patientId FROM Patients WHERE regNo = ?', [regNo], (error, results) => {
      if (error) {
          return res.status(500).json({ error: 'Database query failed.' });
      }
      if (results.length > 0) {
          return res.json({ patientId: results[0].patientId });
      } else {
          return res.status(404).json({ error: 'Patient not found.' });
      }
  });
});

app.get('/api/patients', (req, res) => {
    const flag = parseInt(req.query.flag);
    const searchValue = req.query.searchValue || '';

    // Validate flag parameter
    if (![1, 2, 3, 4, 5].includes(flag)) {
        return res.status(400).json({ message: 'Invalid flag value. Use 1, 2, 3, or 4.' });
    }

    // Call the stored procedure with the provided flag and searchValue
    db.query('CALL ListPatients(?, ?)', [flag, searchValue], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results[0]);  // Return the results from the stored procedure
    });
});

app.get('/api/appointment-statistics', (req, res) => {
    db.query('CALL GetAppointmentStatistics()', (error, results) => {
        if (error) {
            console.error('Error executing stored procedure:', error);
            return res.status(500).send('Internal Server Error');
        }
        
        // results[0] contains the results from the stored procedure
        res.json(results[0]); // Return the JSON response
    });
});

app.get('/api/appointments', (req, res) => {
    const flag = parseInt(req.query.flag);
    const searchValue = req.query.searchValue || null;

    // Validate flag parameter
    if (![1, 2, 3, 4].includes(flag)) {
        return res.status(400).json({ message: 'Invalid flag value. Use 1, 2, 3, or 4.' });
    }

    // Call the stored procedure with the provided flag and searchValue
    db.query('CALL ListAppointments(?, ?)', [flag, searchValue], (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log the error for debugging
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results[0]);  // Return the results from the stored procedure
    });
});


app.post('/api/get-patient-id', (req, res) => {
    const { reg_no, phone_no } = req.body; // Extract registration number and phone number from request body
    console.log('Request received:', req.body);
    // Input validation
    if (!reg_no && !phone_no) {
        return res.status(400).json({ error: 'At least one of reg_no or phone_no must be provided.' });
    }

    // Call the stored procedure
    db.query('CALL GetPatientId(?, ?)', [reg_no || null, phone_no || null], (error, results) => {
        console.log('Request received:', res.body);
        if (error) {
            console.error('Error executing stored procedure:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if results are returned
        if (results[0].length > 0) {
            return res.json({ patientId: results[0][0].pat_id }); // Return the patient ID
        } else {
            return res.status(404).json({ message: 'No patient found.' }); // No patient found
        }
    });
});

app.get('/api/doctors', (req, res) => {
  const flag = parseInt(req.query.flag);
  const searchValue = req.query.searchValue || '';

  // Validate flag parameter
  if (![1, 2, 3].includes(flag)) {
      return res.status(400).json({ message: 'Invalid flag value. Use 1, 2, or 3.' });
  }

  // Call the stored procedure with the provided flag and searchValue
  db.query('CALL ListDoctors(?, ?)', [flag, searchValue], (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
      }
      res.json(results[0]);  // Return the results from the stored procedure
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
