// Automated Test Suite for Employee Management System
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

test('Verification: index.html contains Presentation, SEED, and all core modules', () => {
  const htmlPath = path.join(rootDir, 'index.html');
  assert.ok(fs.existsSync(htmlPath), 'index.html must exist');
  const html = fs.readFileSync(htmlPath, 'utf8');

  assert.ok(html.includes('Employee Management System'), 'Must contain title');
  assert.ok(html.includes('presentation'), 'Must contain presentation module');
  assert.ok(html.includes('Employee_Management_System.pptx'), 'Must link to PPTX');
  assert.ok(html.includes('punchOut'), 'Must contain punchOut functionality');
  assert.ok(html.includes('runPayroll'), 'Must contain runPayroll functionality');
  assert.ok(html.includes('exportCSV'), 'Must contain exportCSV functionality');
});

test('Verification: Vercel serverless configuration and routing', () => {
  const vercelPath = path.join(rootDir, 'vercel.json');
  assert.ok(fs.existsSync(vercelPath), 'vercel.json must exist');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  assert.ok(Array.isArray(vercelConfig.rewrites), 'rewrites array must exist');

  const apiIndexPath = path.join(rootDir, 'api', 'index.js');
  assert.ok(fs.existsSync(apiIndexPath), 'api/index.js must exist');
});
