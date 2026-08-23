/**
 * routes/ledger.js — Ledger-related API endpoints.
 *
 * GET /api/ledger         — Return the full chain (all blocks)
 * GET /api/ledger/verify  — Run integrity check and return results per block
 */

const express = require('express');
const router  = express.Router();
const db      = require('../db');
const ledger  = require('../ledger');

// ---- GET /api/ledger — Full raw ledger ----
router.get('/', (req, res) => {
  res.json(db.getLedger());
});

// ---- GET /api/ledger/verify — Chain integrity verification ----
router.get('/verify', (req, res) => {
  const results    = ledger.verifyChain();
  const allValid   = results.every(r => r.valid);
  const brokenAt   = results.filter(r => !r.valid).map(r => r.blockIndex);

  res.json({
    chainIntact: allValid,
    brokenAt,
    totalBlocks: results.length,
    results,
  });
});

module.exports = router;
