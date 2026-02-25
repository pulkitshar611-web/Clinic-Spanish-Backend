-- Database Schema for Clinic Management System (Clinical Pro)
-- Consolidated from database.sql, create-appointments-table.js, and update-schema.js

CREATE DATABASE IF NOT EXISTS clinic_erp;
USE clinic_erp;

-- 1. Users & Auth (Foundation)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'staff', 'accountant', 'patient') DEFAULT 'staff',

    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

-- 2. Configuration & Catalogs
CREATE TABLE IF NOT EXISTS tax_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rnc VARCHAR(20),
    company_name VARCHAR(100),
    tax_rate DECIMAL(5,2) DEFAULT 18.00,
    currency VARCHAR(10) DEFAULT 'DOP',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS service_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS expense_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

-- 3. Consultorios Module (Doctors & Patients)
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Optional link to user login
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20),
    dob DATE,
    blood_group VARCHAR(10),
    email VARCHAR(100),
    mobile VARCHAR(20),
    alternative_contact VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    designation VARCHAR(100),
    department VARCHAR(100),
    specialization VARCHAR(100),
    experience_years INT,
    experience VARCHAR(50), -- Added from update-schema.js
    license_number VARCHAR(50),
    license_expiry_date DATE,
    education TEXT,
    certifications TEXT,
    joining_date DATE,
    employee_id VARCHAR(50),
    room_cabin_number VARCHAR(50),
    available_days VARCHAR(100),
    schedule VARCHAR(255), -- Added from update-schema.js
    start_time TIME,
    end_time TIME,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    profile_photo VARCHAR(255),
    image_url VARCHAR(255), -- Added from update-schema.js
    license_document VARCHAR(255),
    education_certificate VARCHAR(255),
    additional_documents VARCHAR(255),
    commission_rate DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('Disponible', 'En Consulta', 'Fuera de Servicio', 'Active', 'Inactive') DEFAULT 'Disponible', -- Updated from update-schema.js
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- Link to user login

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dob DATE,
    gender ENUM('M', 'F', 'Other'),
    identification_number VARCHAR(20) UNIQUE, -- Cedula/Passport
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    insurance_provider_id INT,
    insurance_policy_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

-- Appointments Table (Added from create-appointments-table.js)
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
);

CREATE TABLE IF NOT EXISTS lab_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    order_type VARCHAR(100),
    description TEXT,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    medication VARCHAR(255) NOT NULL,
    dosage VARCHAR(100),
    duration VARCHAR(100),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- 4. ARS / Insurance Module
CREATE TABLE IF NOT EXISTS ars_companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rnc VARCHAR(20),
    type VARCHAR(50) DEFAULT 'Privada',
    status VARCHAR(50) DEFAULT 'Activo',
    contact_phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    payment_terms_days INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ars_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ars_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (ars_id) REFERENCES ars_companies(id)
);

-- Services offered by clinic
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    base_price DECIMAL(10,2) NOT NULL,
    tax_applicable TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES service_categories(id)
);

-- ARS Coverage / Rates
CREATE TABLE IF NOT EXISTS ars_coverage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ars_id INT NOT NULL,
    plan_id INT, -- specific plan or null for all
    service_id INT NOT NULL,
    coverage_amount DECIMAL(10,2),
    copay_amount DECIMAL(10,2),
    coverage_percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (ars_id) REFERENCES ars_companies(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- 5. Billing & CxC Module
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(20) UNIQUE NOT NULL, -- e.g. B01...
    ncf VARCHAR(20), -- Comprobante Fiscal
    ncf_expiration_date DATE,
    patient_id INT,
    doctor_id INT, -- Referring or treating doctor
    ars_id INT, -- If insurance invoice
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    insurance_coverage_amount DECIMAL(10,2) DEFAULT 0.00, -- Amount covered by ARS
    patient_copay_amount DECIMAL(10,2) DEFAULT 0.00, -- Amount patient pays
    total_amount DECIMAL(10,2) DEFAULT 0.00, -- Final total (sub + tax - discount)
    status ENUM('draft', 'posted', 'paid', 'void', 'overdue') DEFAULT 'draft',
    payment_status ENUM('unpaid', 'partial', 'paid') DEFAULT 'unpaid',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (ars_id) REFERENCES ars_companies(id)
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    service_id INT,
    description VARCHAR(255),
    quantity DECIMAL(10,2) DEFAULT 1.00,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_line DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- 7. Caja / Payments
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT, -- Can be null if general income
    patient_id INT,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'card', 'transfer', 'check', 'insurance_payment') NOT NULL,
    reference_number VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    is_reconciled TINYINT DEFAULT 0,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- 6. CxP / Accounts Payable / Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rnc VARCHAR(20),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS supplier_invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_id INT NOT NULL,
    invoice_number VARCHAR(50), -- Supplier's invoice number
    ncf VARCHAR(20),
    issue_date DATE NOT NULL,
    due_date DATE,
    total_amount DECIMAL(10,2) NOT NULL,
    balance_due DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending',
    expense_category_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (expense_category_id) REFERENCES expense_categories(id)
);

CREATE TABLE IF NOT EXISTS supplier_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_invoice_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'transfer', 'check') NOT NULL,
    reference_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    is_reconciled TINYINT DEFAULT 0,
    FOREIGN KEY (supplier_invoice_id) REFERENCES supplier_invoices(id)
);

-- 8. Income & Expenses
CREATE TABLE IF NOT EXISTS direct_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_category_id INT,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_method ENUM('cash', 'card', 'transfer', 'check'),
    reference_number VARCHAR(50),
    is_prepaid TINYINT DEFAULT 0, -- Gastos Anticipados
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    is_reconciled TINYINT DEFAULT 0,
    FOREIGN KEY (expense_category_id) REFERENCES expense_categories(id)
);

-- 9. Inventory & Assets
CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    category VARCHAR(100),
    description TEXT,
    unit_measure VARCHAR(20) DEFAULT 'unit',
    current_stock DECIMAL(10,2) DEFAULT 0.00,
    reorder_level DECIMAL(10,2) DEFAULT 10.00,
    cost_price DECIMAL(10,2) DEFAULT 0.00,
    supplier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    transaction_type ENUM('in', 'out', 'adjustment') NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);

CREATE TABLE IF NOT EXISTS fixed_assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    serial_number VARCHAR(50),
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    current_value DECIMAL(10,2),
    location VARCHAR(100),
    status ENUM('active', 'disposed', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

-- 10. Capital & Shareholders
CREATE TABLE IF NOT EXISTS shareholders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    legal_id VARCHAR(20),
    email VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'Socio Inversionista',
    status ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    share_percentage DECIMAL(5,2) DEFAULT 0.00,
    join_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS capital_contributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shareholder_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    contribution_type VARCHAR(50) DEFAULT 'Efectivo',
    shares_count INT DEFAULT 0,
    contribution_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0,
    FOREIGN KEY (shareholder_id) REFERENCES shareholders(id)
);

CREATE TABLE IF NOT EXISTS capital_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Ingreso', 'Egreso', 'Transferencia', 'Ajuste') NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    partner_name VARCHAR(255),
    shareholder_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    movement_date DATE NOT NULL,
    reference VARCHAR(100),
    is_deleted TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shareholder_id) REFERENCES shareholders(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS shareholder_cxp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shareholder_id INT NOT NULL,
    concept VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    expiration_date DATE NOT NULL,
    priority ENUM('Baja', 'Media', 'Alta') DEFAULT 'Media',
    status ENUM('Pendiente', 'Pagado', 'Vencido', 'Programado') DEFAULT 'Pendiente',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (shareholder_id) REFERENCES shareholders(id)
);

-- 11. NCF & Tax Sequences
CREATE TABLE IF NOT EXISTS ncf_sequences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    prefix VARCHAR(10) NOT NULL,
    current_sequence INT DEFAULT 1,
    max_sequence INT NOT NULL,
    expiration_date DATE,
    status ENUM('active', 'expired', 'exhausted', 'alert') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);

-- 12. Calendar Events
CREATE TABLE IF NOT EXISTS calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    event_type ENUM('payment', 'collection', 'meeting', 'other') DEFAULT 'other',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted TINYINT DEFAULT 0
);
