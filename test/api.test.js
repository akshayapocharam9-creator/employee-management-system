// Automated Test Suite for Employee Management System (Original Integrity)
import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(dir, '..');

test('Verification: data.json schema and seed integrity', () => {
  const dataPath = path.join(rootDir, 'data.json');
  assert.ok(fs.existsSync(dataPath), 'data.json must exist');
  const raw = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(raw);

  assert.ok(Array.isArray(data.employees), 'employees array must exist');
  assert.ok(Array.isArray(data.attendance), 'attendance array must exist');
  assert.ok(Array.isArray(data.leaves), 'leaves array must exist');
  assert.ok(Array.isArray(data.payroll), 'payroll array must exist');

  assert.ok(data.employees.length >= 6, 'Must contain at least 6 initial employees');
  for (const emp of data.employees) {
    assert.ok(emp.id, 'Employee must have an id');
    assert.ok(emp.firstName, 'Employee must have firstName');
    assert.ok(emp.email, 'Employee must have email');
    assert.ok(emp.department, 'Employee must have department');
    assert.ok(emp.salary?.basic, 'Employee must have basic salary');
  }
});

test('Verification: Academic Presentation PPTX exists and is non-empty', () => {
  const pptxPath = path.join(rootDir, 'Employee_Management_System.pptx');
  assert.ok(fs.existsSync(pptxPath), 'Employee_Management_System.pptx must exist');
  const stats = fs.statSync(pptxPath);
  assert.ok(stats.size > 200000, `PPTX size should be > 200KB, found: ${stats.size}`);
});

test('Verification: index.html contains original structure and core modules', () => {
  const htmlPath = path.join(rootDir, 'index.html');
  assert.ok(fs.existsSync(htmlPath), 'index.html must exist');
  const html = fs.readFileSync(htmlPath, 'utf8');

  assert.ok(html.includes('Employee Management System'), 'Must contain title');
  assert.ok(html.includes('dashboard'), 'Must contain dashboard module');
  assert.ok(html.includes('employees'), 'Must contain employees module');
  assert.ok(html.includes('attendance'), 'Must contain attendance module');
  assert.ok(html.includes('payroll'), 'Must contain payroll module');
  assert.ok(html.includes('reports'), 'Must contain reports module');
  assert.ok(html.includes('runPayroll'), 'Must contain runPayroll functionality');
  assert.ok(html.includes('exportCSV'), 'Must contain exportCSV functionality');
});

test('Verification: Production hosting configuration and routing files', () => {
  const vercelPath = path.join(rootDir, 'vercel.json');
  assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  assert.ok(Array.isArray(vercelConfig.rewrites), 'rewrites array must exist');

  const apiIndexPath = path.join(rootDir, 'api', 'index.js');
  assert.ok(fs.existsSync(apiIndexPath), 'api/index.js must exist');

  const renderPath = path.join(rootDir, 'render.yaml');
  assert.ok(fs.existsSync(renderPath), 'render.yaml must exist');

  const procfilePath = path.join(rootDir, 'Procfile');
  assert.ok(fs.existsSync(procfilePath), 'Procfile must exist');
});

test('Verification: Enterprise features, role management, and presentation in index.html', () => {
  const htmlPath = path.join(rootDir, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // RBAC & Users
  assert.ok(html.includes('Admin') && html.includes('HR') && html.includes('Employee'), 'Must support Admin, HR, and Employee roles');
  assert.ok(html.includes("role = sessionStorage.getItem('role')"), 'Must track role in session');

  // Presentation & Academic Submission
  assert.ok(html.includes('presentation'), 'Must contain dedicated presentation section');
  assert.ok(html.includes('Employee_Management_System.pptx'), 'Must provide download link for PPTX');
  assert.ok(html.includes('SLIDES = ['), 'Must contain slide deck data for browser viewing');

  // Operational Modules
  assert.ok(html.includes('punch()') && html.includes('punchOut()'), 'Must support punch in and punch out');
  assert.ok(html.includes('leaveBalance'), 'Must support leave balance tracking');
  assert.ok(html.includes('payslip('), 'Must support payslip generation');
  assert.ok(html.includes('exportCSV'), 'Must support CSV exports');
});

test('Verification: server.js and api/index.js RBAC and data validation', () => {
  const serverPath = path.join(rootDir, 'server.js');
  const serverCode = fs.readFileSync(serverPath, 'utf8');

  assert.ok(serverCode.includes('x-user-role'), 'server.js must inspect x-user-role header');
  assert.ok(serverCode.includes('already exists'), 'server.js must guard against duplicate employee IDs or codes');
  assert.ok(serverCode.includes('cascade delete'), 'server.js must cascade delete related records');

  const apiPath = path.join(rootDir, 'api', 'index.js');
  const apiCode = fs.readFileSync(apiPath, 'utf8');
  assert.ok(apiCode.includes('x-user-role'), 'api/index.js must inspect x-user-role header');
});


