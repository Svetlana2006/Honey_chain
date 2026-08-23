/**
 * db.js — Simple JSON file-based persistence layer.
 * Stores two files: batches.json (off-chain metadata) and ledger.json (hash-chain).
 * No external database needed — perfect for an offline hackathon demo.
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR     = path.join(__dirname, '..', 'data');
const BATCHES_FILE = path.join(DATA_DIR, 'batches.json');
const LEDGER_FILE  = path.join(DATA_DIR, 'ledger.json');

// Ensure data directory exists on first run
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(BATCHES_FILE)) fs.writeFileSync(BATCHES_FILE, '[]');
if (!fs.existsSync(LEDGER_FILE))  fs.writeFileSync(LEDGER_FILE,  '[]');

// ---------- Generic helpers ----------

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ---------- Batch CRUD ----------

function getAllBatches() {
  return readJSON(BATCHES_FILE);
}

function getBatchById(id) {
  return getAllBatches().find(b => b.id === id) || null;
}

function saveBatch(batch) {
  const batches = getAllBatches();
  batches.push(batch);
  writeJSON(BATCHES_FILE, batches);
}

/**
 * Directly mutates a batch field — used by the tamper-demo endpoint.
 * Returns the updated batch or null if not found.
 */
function tamperBatch(id, field, newValue) {
  const batches = getAllBatches();
  const idx = batches.findIndex(b => b.id === id);
  if (idx === -1) return null;
  batches[idx][field] = newValue;
  writeJSON(BATCHES_FILE, batches);
  return batches[idx];
}

// ---------- Ledger CRUD ----------

function getLedger() {
  return readJSON(LEDGER_FILE);
}

function appendLedgerBlock(block) {
  const ledger = getLedger();
  ledger.push(block);
  writeJSON(LEDGER_FILE, ledger);
}

function getLedgerBlock(batchId) {
  return getLedger().find(b => b.batchId === batchId) || null;
}

module.exports = {
  getAllBatches,
  getBatchById,
  saveBatch,
  tamperBatch,
  getLedger,
  appendLedgerBlock,
  getLedgerBlock,
};
