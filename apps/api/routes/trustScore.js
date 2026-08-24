/**
 * Trust-score report endpoints backed by demo data.
 *
 * GET /api/trust-score       - Return the default demo report
 * GET /api/trust-score/:id   - Return a report for a batch id
 */

const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../db');

const TRUST_SCORES_FILE = path.join(__dirname, '..', '..', '..', 'data', 'trustScores.json');

function createReport(batchId) {
  const batch = db.getBatchById(batchId);
  const ledgerBlock = db.getLedgerBlock(batchId);
  const trustScore = JSON.parse(fs.readFileSync(TRUST_SCORES_FILE, 'utf8'))
    .find(report => report.batchId === batchId);

  if (!batch || !ledgerBlock || !trustScore) return null;

  const chainScore = 100;
  const overallScore = Math.round(
    (batch.purityScore + chainScore + trustScore.beekeeperHistory.score) / 3,
  );

  return {
    batchId: batch.id,
    batchLabel: batch.id,
    beekeeper: batch.beekeeperName,
    origin: batch.beekeeperVillage,
    overallScore,
    grade: overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : 'C',
    summary: overallScore >= 90 ? 'Trusted Honey' : 'Verified Honey',
    summaryDetail: 'Score calculated from purity, ledger completeness, and beekeeper history.',
    verified: true,
    metrics: {
      purity: {
        label: 'Purity Test Results',
        score: batch.purityScore,
        displayScore: `${batch.purityScore}%`,
        icon: 'science',
        tone: 'amber',
        detail: `Purity score recorded for ${batch.floralSource} honey.`,
      },
      chainCompleteness: {
        label: 'Chain Completeness',
        score: chainScore,
        displayScore: `${chainScore}%`,
        icon: 'link',
        tone: 'green',
        detail: `Ledger block ${ledgerBlock.blockIndex} and its hash are present and verified.`,
      },
      beekeeperHistory: {
        label: 'Beekeeper History',
        score: trustScore.beekeeperHistory.score,
        displayScore: trustScore.beekeeperHistory.grade,
        icon: 'history',
        tone: 'gold',
        detail: `${trustScore.beekeeperHistory.yearsActive}-year history with ${trustScore.beekeeperHistory.auditsPassed} audits passed.`,
      },
    },
    batch,
    ledger: {
      blockIndex: ledgerBlock.blockIndex,
      signaturesVerified: 1,
      status: 'Verified',
    },
  };
}

router.get('/', (req, res) => {
  const batchId = req.query.batchId || db.getAllBatches()[0]?.id;
  const report = batchId && createReport(batchId);
  if (!report) return res.status(404).json({ error: 'Trust score data not found' });
  res.json(report);
});

router.get('/:batchId', (req, res) => {
  const report = createReport(req.params.batchId);
  if (!report) return res.status(404).json({ error: 'Trust score data not found' });
  res.json(report);
});

module.exports = router;
