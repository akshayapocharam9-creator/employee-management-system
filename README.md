# Employee Management System (EMS)

**Course:** Web Technology (B.Tech Data Science)  
**Project Category:** Semester Academic Web Application Submission  
**Student Name:** Laxmi Pocharam  
**Repository:** [https://github.com/akshayapocharam9-creator/employee-management-system](https://github.com/akshayapocharam9-creator/employee-management-system)  
**Live Public Web Application:** [https://employee-management-system-pink-tau.vercel.app](https://employee-management-system-pink-tau.vercel.app) *(or GitHub Pages / Vercel deployment)*  
**Presentation Slides (.PPTX):** Accessible directly within the web application via the **Presentation** tab and downloadable as [`Employee_Management_System.pptx`](./Employee_Management_System.pptx).

---

## 1. Project Overview

The **Employee Management System (EMS)** is a responsive, single-page full-stack web application designed to centralize and automate core human resource operations. It replaces manual paper forms and disjointed spreadsheets with a unified system managing:

- Personnel profiles and departmental assignments
- Daily digital attendance (check-in/check-out punch) with automated late-detection
- Leave application, multi-category quotas, and administrative review workflows
- Automated monthly payroll calculation with statutory deductions (PF, Tax) and printable payslips
- Real-time management analytics, departmental cost distribution charts, and CSV data export
- Built-in academic presentation viewer directly exposing all 10 presentation slides and offering a 1-click download of the original `.pptx` presentation file.

---

## 2. Problem Statement

Organizations and academic departments frequently manage employee lifecycle records using disconnected spreadsheets, paper logbooks, and email threads. This introduces critical operational bottlenecks:

1. **Information Fragmentation:** Personnel records, bank details, and emergency contacts are scattered across disparate documents.
2. **Attendance & Time Theft Inefficiencies:** Manual registers are slow, difficult to audit, and prone to proxy attendance or calculation errors.
3. **Payroll Calculation Delays:** Manual computation of allowances, tax slabs, provident fund deductions, and unpaid leave penalties results in administrative burden and human error (~40% of HR time is lost to routine paperwork).
4. **Lack of Access Control (RBAC):** Spreadsheets fail to provide role-based security, exposing sensitive salary records to unauthorized viewers.
5. **Absence of Real-Time Analytics:** Management lacks immediate visual reporting on departmental headcount and payroll allocations.

---

## 3. Project Objectives

- **Centralize Workforce Records:** Provide a single, validated database of employees across Engineering, HR, Data Science, UI/UX Design, and Operations.
- **Digitize Attendance Tracking:** Provide one-click daily punch-in and punch-out logging, calculating total work hours and flag attendance status (Present, Late, Half-Day, Absent, On Leave).
- **Automate Leave Approvals & Balance Tracking:** Allow staff to submit leave requests (Casual, Sick, Paid, Unpaid) and automatically debit balances upon administrative approval.
- **Automate Monthly Compensation:** Compute gross salary, income tax, provident fund, and attendance penalties in one batch run with individual printable payslips.
- **Implement Role-Based Access Control (RBAC):** Restrict sensitive administrative operations (salary adjustments, employee deletion, payroll execution) to Admin and HR roles.
- **Ensure Responsive & Accessible UI:** Maintain a clean, accessible interface supporting system dark/light themes, modal dialogs, and mobile viewports.

---

## 4. Implemented Modules & Features

### A. Authentication & Session Management
- **Role Switcher / Session State:** Supports **Admin**, **HR Specialist**, and **Employee** roles saved via `sessionStorage`.
- **Role-Based Redirects & Permissions:**
  - **Admin:** Full access to view, add, edit, and cascade-delete employees; manage attendance and approve/reject leave requests; execute monthly payroll runs; view reports.
  - **HR Specialist:** Add and edit employees; adjust attendance statuses; review leave requests; run payroll; view reports. (Cannot delete employees).
  - **Employee:** View self-profile; daily punch in/out; submit leave requests; inspect personal leave balances; review personal payroll slips. Restricted from accessing organization-wide reports and administrative forms.
- **Presentation Pre-login Access:** Visitors and faculty can view the full 10-slide academic project presentation directly from the login screen without needing to sign in.

### B. Employee Directory & Personnel Management
- **Search & Filtering:** Real-time multi-field search (by employee name, code, designation, or email) combined with a departmental dropdown filter.
- **CRUD Operations:** Modal dialogs for adding new personnel or updating existing contact, role, status, and compensation details.
- **Cascading Integrity:** Deleting an employee automatically removes their associated attendance, leave, and payroll records to avoid orphaned entries.

### C. Attendance & Leave Workflow
- **Digital Punch-In & Punch-Out:** Logs exact check-in and check-out timestamps, flags arrivals past 10:00 AM as "Late", and computes total duty hours.
- **Leave Balance Display:** Displays real-time Casual, Sick, and Paid leave balances directly above the application form.
- **Leave Application & Review:** Date validation (`endDate >= startDate`), calculating total calendar days. HR/Admin reviews immediately deduct leave days from the employee's quota upon approval.

### D. Automated Payroll & Payslips
- **Automated Batch Processing:** 1-click execution for the active month calculating:
  - $\text{Gross Salary} = \text{Basic} + \text{HRA} + \text{Special Allowances}$
  - $\text{Tax Deduction} = \text{Gross} \times \text{Tax Rate}$
  - $\text{Provident Fund (PF)} = \text{Basic} \times \text{PF Rate}$
  - $\text{Total Deductions} = \text{Tax} + \text{PF} + \text{Attendance Penalty}$
  - $\text{Net Salary} = \text{Gross} - \text{Total Deductions}$
- **Printable Payslip Modal:** Itemized breakdown with dedicated `window.print()` media styles for clean invoice printing.

### E. Analytics & Reporting
- Departmental payroll distribution bar charts.
- Status distribution for headcount, attendance, and leave requests.
- **CSV Data Export:** 1-click download of all employee master records in formatted CSV format.

### F. Academic Presentation Module (.PPTX)
- Direct link and 1-click download for the project presentation file (`Employee_Management_System.pptx`).
- Interactive 10-slide viewer featuring slide counters, previous/next controls, quick jump buttons, keyboard arrow navigation (`←` / `→`), and an "All Slides" overview mode.

---

## 5. Technology Stack

| Layer | Technologies Used | Rationale |
| :--- | :--- | :--- |
| **Frontend** | Semantic HTML5, Modern CSS3, Vanilla JavaScript (ES6+) | Zero external UI dependencies, fast loading, dark-mode native styling, accessible `<dialog>` modals |
| **Backend** | Node.js (v18+ / v24), Express.js (v4.21) | Lightweight, asynchronous REST API for JSON resource management |
| **State & Persistence**| Express JSON file database (`db.json` / `data.json`) + Client-side `localStorage` fallback | Dual-mode resilience: operates with real server-side REST API, and falls back seamlessly to browser storage on static hosting |
| **Deployment** | Vercel Serverless Functions (`api/index.js`), GitHub Pages, and Node.js daemon | Multi-platform deployment ready |
| **Version Control**| Git, GitHub | Academic repository tracking |

---

## 6. Architecture & System Design

The system implements a standard **3-Tier Web Architecture**:

```
+-------------------------------------------------------------+
|                 1. PRESENTATION LAYER                       |
|   HTML5 / CSS3 / Vanilla JS (SPA with Dark/Light Support)    |
|   - Dashboard, Employee Directory, Attendance & Leaves      |
|   - Payroll & Payslips, Departmental Reports, PPT Viewer    |
+-------------------------------------------------------------+
                              |
                     RESTful JSON API (/api)
                              |
+-------------------------------------------------------------+
|                 2. APPLICATION LAYER                        |
|   Node.js + Express.js REST API Server / Serverless Handler |
|   - Authentication & Role Filtering                         |
|   - Attendance & Punch Duration Calculator                  |
|   - Payroll Tax & PF Computation Engine                     |
|   - Cascade Integrity Enforcement                           |
+-------------------------------------------------------------+
                              |
                     File I/O / LocalStorage
                              |
+-------------------------------------------------------------+
|                     3. DATA LAYER                           |
|   Persistent Storage (db.json / data.json / localStorage)   |
|   - employees: Personnel, Role, Salary Structure            |
|   - attendance: Check-in, Check-out, Status, Work Hours     |
|   - leaves: Requests, Date Range, Status, Balances          |
|   - payroll: Batch Disbursed Records, Itemized Deductions   |
+-------------------------------------------------------------+
```

---

## 7. Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.x, 20.x, or 24.x recommended)
- Git installed on your system

### Step 1: Clone the Repository
```bash
git clone https://github.com/akshayapocharam9-creator/employee-management-system.git
cd employee-management-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Application
```bash
npm start
```
The server will start at:
```
http://localhost:3000
```
Open your browser and navigate to `http://localhost:3000`.

### Step 4: Run Automated Tests
```bash
npm test
```
Runs the automated test suite verifying data integrity, schema consistency, presentation presence, and routing configuration.

---

## 8. Environment Configuration

Copy `.env.example` to `.env` if you wish to configure custom ports:
```bash
# .env
PORT=3000
NODE_ENV=development
```

---

## 9. Academic Presentation (.PPTX) Access

The presentation for this Web Technology project is preserved in the repository root as:
```
Employee_Management_System.pptx
```
**Access methods:**
1. **Via Web App:** Click the **Presentation** tab in the navigation bar to navigate through all 10 interactive slides or click the download button.
2. **Via Login Screen:** Click the *"📊 View Project Presentation"* button directly before logging in.
3. **Direct File Download:** Download [`Employee_Management_System.pptx`](./Employee_Management_System.pptx) from the GitHub repository and open in Microsoft PowerPoint, LibreOffice Impress, or Google Slides.

---

## 10. Academic Attribution & Submission Details

- **Student:** Laxmi Pocharam
- **Course:** Web Technology
- **Program:** B.Tech Data Science
- **Semester Project Submission**
- **Date:** October 2026
