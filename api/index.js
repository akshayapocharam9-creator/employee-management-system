// Vercel Serverless Function entry point for Express REST API
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(dir, '..');
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DB = isServerless ? path.join('/tmp', 'db.json') : path.join(rootDir, 'db.json');
const COLS = ['employees', 'attendance', 'leaves', 'payroll'];

const getSeedData = () => {
  const seedPath = path.join(rootDir, 'data.json');
  return JSON.parse(fs.readFileSync(seedPath, 'utf8'));
};

const load = () => {
  try {
    if (!fs.existsSync(DB)) {
      const seed = getSeedData();
      fs.writeFileSync(DB, JSON.stringify(seed, null, 2));
      return seed;
    }
    return JSON.parse(fs.readFileSync(DB, 'utf8'));
  } catch (err) {
    return getSeedData();
  }
};

const save = (d) => {
  try {
    fs.writeFileSync(DB, JSON.stringify(d, null, 2));
  } catch (err) {
    console.error('Save error:', err);
  }
};

const app = express();
app.use(express.json());

app.get('/api/state', (_, res) => res.json(load()));

app.param('col', (req, res, next, col) =>
  COLS.includes(col) ? next() : res.status(404).json({ error: 'Unknown collection' }));

app.get('/api/:col', (req, res) => res.json(load()[req.params.col]));

app.post('/api/:col', (req, res) => {
  const d = load(), item = req.body, col = req.params.col;
  if (!item?.id) return res.status(400).json({ error: 'id required' });

  if (col === 'employees') {
    const role = req.headers['x-user-role'];
    if (role && !['Admin', 'HR'].includes(role)) {
      return res.status(403).json({ error: 'Forbidden: Only Admin and HR can add employees' });
    }
    if (d.employees.some((e) => e.employeeCode && e.employeeCode.toLowerCase() === (item.employeeCode || '').toLowerCase())) {
      return res.status(400).json({ error: `Employee Code ${item.employeeCode} already exists` });
    }
    if (d.employees.some((e) => e.email && e.email.toLowerCase() === (item.email || '').toLowerCase())) {
      return res.status(400).json({ error: `Email ${item.email} is already registered` });
    }
  }

  d[col].unshift(item);
  save(d);
  res.status(201).json(item);
});

app.put('/api/:col', (req, res) => {
  const col = req.params.col;
  if (col === 'payroll') {
    const role = req.headers['x-user-role'];
    if (role && !['Admin', 'HR'].includes(role)) {
      return res.status(403).json({ error: 'Forbidden: Only Admin and HR can execute payroll runs' });
    }
  }
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'array required' });
  const d = load();
  d[col] = req.body;
  save(d);
  res.json({ ok: true, count: req.body.length });
});

app.put('/api/:col/:id', (req, res) => {
  const d = load(), col = req.params.col, list = d[col];
  const i = list.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'Not found' });

  if (col === 'employees') {
    const role = req.headers['x-user-role'];
    if (role && !['Admin', 'HR'].includes(role)) {
      return res.status(403).json({ error: 'Forbidden: Only Admin and HR can edit employee records' });
    }
    if (req.body.employeeCode && d.employees.some((e) => e.id !== req.params.id && e.employeeCode?.toLowerCase() === req.body.employeeCode.toLowerCase())) {
      return res.status(400).json({ error: `Employee Code ${req.body.employeeCode} already in use` });
    }
  }

  if (col === 'leaves' && req.body.status && ['Approved', 'Rejected'].includes(req.body.status)) {
    const role = req.headers['x-user-role'];
    if (role && !['Admin', 'HR'].includes(role)) {
      return res.status(403).json({ error: 'Forbidden: Only Admin and HR can review leaves' });
    }
  }

  list[i] = { ...list[i], ...req.body, id: list[i].id };
  save(d);
  res.json(list[i]);
});

app.delete('/api/:col/:id', (req, res) => {
  const d = load(), { col, id } = req.params;
  if (col === 'employees') {
    const role = req.headers['x-user-role'];
    if (role && role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden: Only Admin can delete employees' });
    }
  }

  d[col] = d[col].filter((x) => x.id !== id);
  if (col === 'employees')
    for (const c of ['attendance', 'leaves', 'payroll']) d[c] = d[c].filter((x) => x.employeeId !== id);
  save(d);
  res.json({ ok: true });
});

export default app;
