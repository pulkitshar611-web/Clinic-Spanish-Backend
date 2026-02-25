const db = require('./config/db');

async function setup() {
  try {
    await db.query(`
            CREATE TABLE IF NOT EXISTS consultations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                consultation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                heart_rate VARCHAR(20),
                temperature VARCHAR(20),
                respiratory_rate VARCHAR(20),
                blood_pressure VARCHAR(20),
                background TEXT,
                reason_for_consultation TEXT,
                physical_examination TEXT,
                diagnosis_code VARCHAR(20),
                diagnosis_description TEXT,
                clinical_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                is_deleted TINYINT DEFAULT 0,
                FOREIGN KEY (patient_id) REFERENCES patients(id),
                FOREIGN KEY (doctor_id) REFERENCES doctors(id)
            )
        `);
    console.log("Consultations table checked/created.");
    process.exit(0);
  } catch (err) {
    console.error("Error creating table:", err);
    process.exit(1);
  }
}

setup();
