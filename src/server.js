const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Load Routes
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/dashboard', require('./modules/dashboard/dashboard.routes'));
app.use('/api', require('./modules/consultorios/consultorios.routes')); // Handles /consultorios, /doctors, /patients
app.use('/api', require('./modules/billing/billing.routes')); // Handles /invoices
app.use('/api/ars', require('./modules/ars/ars.routes'));
app.use('/api/config', require('./modules/config/config.routes'));
app.use('/api/cxc', require('./modules/cxc/cxc.routes'));
app.use('/api/cxp', require('./modules/cxp/cxp.routes'));
app.use('/api/caja', require('./modules/caja/caja.routes'));
app.use('/api/income_expenses', require('./modules/income_expenses/income_expenses.routes'));
app.use('/api/assets', require('./modules/inventory_assets/inventory_assets.routes'));
app.use('/api/capital', require('./modules/capital/capital.routes'));
app.use('/api/reports', require('./modules/reports/reports.routes'));
app.use('/api/calendar', require('./modules/calendar/calendar.routes'));
app.use('/api/ncf', require('./modules/ncf/ncf.routes'));
app.use('/api/users', require('./modules/users/users.routes'));

app.get('/', (req, res) => {
  res.send('Clinic ERP Backend Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
