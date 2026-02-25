const service = require('./consultorios.service');

exports.createDoctor = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.files) {
      if (req.files.profilePhoto) data.profilePhoto = req.files.profilePhoto[0].path;
      if (req.files.licenseDoc) data.licenseDoc = req.files.licenseDoc[0].path;
      if (req.files.eduCert) data.eduCert = req.files.eduCert[0].path;
      if (req.files.addDocs) data.addDocs = req.files.addDocs[0].path;
    }

    const { firstName, lastName, department } = data;
    const missing = [];
    if (!firstName) missing.push('First Name');
    if (!lastName) missing.push('Last Name');
    if (!department) missing.push('Department');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(', ')}`
      });
    }

    const id = await service.createDoctor(data);
    res.status(201).json({ success: true, message: 'Doctor created', id });
  } catch (e) {
    console.error("Error creating doctor:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listDoctors = async (req, res) => {
  try {
    const doctors = await service.listDoctors();
    res.json({ success: true, data: doctors });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { first_name, last_name, identification_number } = req.body;
    if (!first_name || !last_name || !identification_number) return res.status(400).json({ success: false, message: 'Missing required fields' });

    const id = await service.createPatient(req.body);
    res.status(201).json({ success: true, message: 'Patient created', id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listPatients = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const patients = await service.listPatients(doctorId);
    res.json({ success: true, data: patients });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getPanel = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const data = await service.getPanelData(doctorId);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getCalendario = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const data = await service.getAllAppointments(doctorId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createLabOrder = async (req, res) => {
  try {
    const id = await service.createLabOrder(req.body);
    res.json({ success: true, data: { id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const id = await service.createPrescription(req.body);
    res.json({ success: true, data: { id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getTodaysSchedule = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const data = await service.getTodaysSchedule(doctorId);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.searchPatients = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });
    const patients = await service.searchPatients(q);
    res.json({ success: true, data: patients });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createConsultation = async (req, res) => {
  try {
    const id = await service.createConsultation(req.body);
    res.status(201).json({ success: true, message: 'Consultation recorded', id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getDoctorPatients = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await service.getDoctorPatients(id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getPatientPortalData = async (req, res) => {
  try {
    const { userId } = req.query; // Assuming we pass userId for now, should use auth middleware token in production
    const data = await service.getPatientPortalData(userId);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const data = await service.getPatientById(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const success = await service.updatePatient(req.params.id, req.body);
    res.json({ success, message: success ? 'Patient updated' : 'Patient not found' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const success = await service.deletePatient(req.params.id);
    res.json({ success, message: success ? 'Patient deleted' : 'Patient not found' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};



exports.deleteDoctor = async (req, res) => {
  try {
    const success = await service.deleteDoctor(req.params.id);
    res.json({ success, message: success ? 'Doctor deleted' : 'Doctor not found' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
