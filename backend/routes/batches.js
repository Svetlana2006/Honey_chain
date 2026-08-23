/**
 * routes/batches.js — All batch-related API endpoints.
 *
 * POST /api/batches          — Register a new honey batch
 * GET  /api/batches          — List all batches
 * GET  /api/batches/:id      — Get one batch (used by verify page)
 * POST /api/batches/:id/tamper — DEMO: edit a past record directly (breaks the chain)
 */

const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const QRCode  = require('qrcode');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const db     = require('../db');
const ledger = require('../ledger');

// ---- Multer: save uploaded photos to /data/photos/ ----
const PHOTOS_DIR = path.join(__dirname, '..', '..', 'data', 'photos');
if (!fs.existsSync(PHOTOS_DIR)) fs.mkdirSync(PHOTOS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PHOTOS_DIR),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ---- POST /api/batches — Register a new batch ----
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      beekeeperName,
      beekeeperVillage,
      hiveId,
      location,
      harvestDate,
      quantity,
      floralSource,
      notes,
    } = req.body;

    // Basic validation
    if (!beekeeperName || !hiveId || !location || !harvestDate || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Simulated purity score (lab-integration ready — replace with real lab API)
    const purityScore = Math.floor(Math.random() * 15) + 85; // 85–100

    const batch = {
      id:               uuidv4(),
      beekeeperName:    beekeeperName.trim(),
      beekeeperVillage: beekeeperVillage?.trim() || '',
      hiveId:           hiveId.trim(),
      location:         location.trim(),
      harvestDate:      harvestDate,
      quantity:         Number(quantity),
      floralSource:     floralSource?.trim() || 'Mixed flora',
      notes:            notes?.trim() || '',
      purityScore,
      photoFilename:    req.file ? req.file.filename : null,
      registeredAt:     new Date().toISOString(),
    };

    // Save batch to DB
    db.saveBatch(batch);

    // Append to hash-chain ledger
    const block = ledger.addToLedger(batch);

    // Generate QR code pointing to the consumer verify page
    // The frontend serves verify.html?id=<batchId>
    const verifyUrl = `http://localhost:3000/verify.html?id=${batch.id}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 300, margin: 2 });

    res.status(201).json({
      success: true,
      batch,
      block,
      qrCode: qrDataUrl,
      verifyUrl,
    });
  } catch (err) {
    console.error('Error registering batch:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ---- GET /api/batches — List all batches ----
router.get('/', (req, res) => {
  res.json(db.getAllBatches());
});

// ---- GET /api/batches/:id — Get one batch ----
router.get('/:id', (req, res) => {
  const batch = db.getBatchById(req.params.id);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });

  const block = db.getLedgerBlock(req.params.id);
  res.json({ batch, block });
});

// ---- POST /api/batches/:id/tamper — DEMO tamper endpoint ----
// Directly edits a field in the off-chain DB without updating the ledger.
// This simulates a bad actor editing the database.
router.post('/:id/tamper', (req, res) => {
  const { field, newValue } = req.body;

  // Only allow tampering fields that are committed to the chain
  const tamperable = ['quantity', 'location', 'harvestDate', 'beekeeperName', 'hiveId', 'purityScore'];
  if (!tamperable.includes(field)) {
    return res.status(400).json({ error: `Field "${field}" is not a chain-committed field` });
  }

  const updated = db.tamperBatch(req.params.id, field, newValue);
  if (!updated) return res.status(404).json({ error: 'Batch not found' });

  res.json({
    success: true,
    message: `Field "${field}" tampered to "${newValue}" in the database (ledger NOT updated)`,
    updated,
  });
});

module.exports = router;
