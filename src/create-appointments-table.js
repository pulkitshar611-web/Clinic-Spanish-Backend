const db = require('./config/db');

async function createAppointmentsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        doctor_id INT NOT NULL,
        patient_id INT NOT NULL,
        appointment_date DATETIME NOT NULL,
        reason VARCHAR(255),
        status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        is_deleted TINYINT DEFAULT 0,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id),
        FOREIGN KEY (patient_id) REFERENCES patients(id)
      );
    `;

    await db.query(query);
    console.log("Appointments table created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating appointments table:", error);
    process.exit(1);
  }
}

createAppointmentsTable();
