# API Integration Status

## Overview
The frontend application has been integrated with the backend API for the core modules: Dashboard, Consultorios, ARS, and Billing.

## Modules Integrated

### 1. Dashboard (`Dashboard.jsx`)
- **Stats**: Fetches real-time counters for Patients, Doctors, Services, and Revenue from `/api/dashboard/stats`.
- **Recent Activity**: (Partially integrated via stats)

### 2. Consultorios (`Consultorios.jsx`, `Medicos.jsx`, `GestionPacientes.jsx`)
- **Doctors**:
  - List doctors from `/api/consultorios/doctors`.
  - Create new doctor via `/api/consultorios/doctors`.
- **Patients**:
  - List patients from `/api/consultorios/patients`.
  - Create new patient via `/api/consultorios/patients` (with ARS selection).

### 3. ARS / Seguros (`ArsCatalogo.jsx`)
- **List**: Fetches ARS providers from `/api/ars`.
- **Create**: Adds new ARS provider via `/api/ars`.

### 4. Billing (`Facturacion.jsx`)
- **List Invoices**: Fetches invoices from `/api/billing/invoices`.
- **Create Invoice**:
  - Uses `NewInvoiceModal` to create invoices via `/api/billing/invoices`.
  - **Dropdowns**: Populates Patient, Doctor, and ARS dropdowns dynamically from their respective APIs.
  - **Items**: Supports adding multiple items (Description, Quantity, Price).

## Services Created
- `consultoriosService.js`: Handles Doctors and Patients operations.
- `arsService.js`: Handles ARS operations.
- `billingService.js`: Handles Invoice operations.
- `dashboardService.js`: Handles Dashboard stats.
- `api/index.js`: Axios instance executing requests to `http://localhost:5000/api`.

## Next Steps
- **Authentication**: Implement Login/Register flow and JWT handling.
- **Service Catalog**: Implement frontend for managing Services (Products) to link with Invoice Items.
- **Inventory/Expenses**: Implement `inventoryService` and `expenseService` connected to backend.
