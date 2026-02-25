const express = require('express');
const router = express.Router();
const controller = require('./consultorios.controller');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/doctors';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Doctors
router.post('/doctors/create', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'licenseDoc', maxCount: 1 },
  { name: 'eduCert', maxCount: 1 },
  { name: 'addDocs', maxCount: 1 }
]), controller.createDoctor);
router.get('/doctors/list', controller.listDoctors);
router.delete('/doctors/:id', controller.deleteDoctor);

// Patients
router.post('/patients/create', controller.createPatient);
router.get('/patients/list', controller.listPatients);

// Consultorios
router.get('/patients/search', controller.searchPatients);
router.post('/orders/create', controller.createLabOrder);
router.post('/prescriptions/create', controller.createPrescription);
router.post('/consultations/create', controller.createConsultation);
router.get('/consultorios/panel', controller.getPanel);
router.get('/consultorios/calendario', controller.getCalendario);
router.get('/consultorios/schedule/today', controller.getTodaysSchedule);
router.get('/doctors/:id/patients', controller.getDoctorPatients);
router.get('/patients/portal', controller.getPatientPortalData);
router.get('/patients/:id', controller.getPatientById);
router.put('/patients/:id', controller.updatePatient);
router.delete('/patients/:id', controller.deletePatient);



module.exports = router;
