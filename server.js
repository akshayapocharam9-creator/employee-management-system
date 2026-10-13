// Employee Management System - REST API (Express + JSON file storage)
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const DB = path.join(dir, 'db.json');
const COLS = ['employees', 'attendance', 'leaves', 'payroll'];
const PORT = process.env.PORT || 3000;

const getSeedData = () => {
  const seedPath = path.join(dir, 'data.json');
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
    console.error('Error saving db.json:', err);
  }
};

const app = express();
app.use(express.json());
app.use(express.static(dir, { index: 'index.html' }));

app.get('/api/state', (_, res) => res.json(load()));

app.param('col', (req, res, next, col) =>
  COLS.includes(col) ? next() : res.status(404).json({ error: 'Unknown collection' }));

app.get('/api/:col', (req, res) => res.json(load()[req.params.col]));

app.post('/api/:col', (req, res) => {
  const d = load(), item = req.body;
  if (!item?.id) return res.status(400).json({ error: 'id required' });
  d[req.params.col].unshift(item);
  save(d);
  res.status(201).json(item);
});

app.put('/api/:col', (req, res) => { // replace whole collection (used by payroll run)
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'array required' });
  const d = load();
  d[req.params.col] = req.body;
  save(d);
  res.json({ ok: true, count: req.body.length });
});

app.put('/api/:col/:id', (req, res) => {
  const d = load(), list = d[req.params.col];
  const i = list.findIndex((x) => x.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: 'Not found' });
  list[i] = { ...list[i], ...req.body, id: list[i].id };
  save(d);
  res.json(list[i]);
});

app.delete('/api/:col/:id', (req, res) => {
  const d = load(), { col, id } = req.params;
  d[col] = d[col].filter((x) => x.id !== id);
  if (col === 'employees') // cascade delete related records
    for (const c of ['attendance', 'leaves', 'payroll']) d[c] = d[c].filter((x) => x.employeeId !== id);
  save(d);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`EMS running at http://localhost:${PORT}`));
