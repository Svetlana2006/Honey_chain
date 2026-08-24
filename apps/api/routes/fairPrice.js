const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const db = require('../db');

const FAIR_PRICES_FILE = path.join(__dirname, '..', '..', '..', 'data', 'fairPrices.json');

function getSuggestion(batchId) {
  const batch = db.getBatchById(batchId);
  const pricing = JSON.parse(fs.readFileSync(FAIR_PRICES_FILE, 'utf8'))
    .find(item => item.batchId === batchId);

  if (!batch || !pricing) return null;

  const purityMultiplier = 1 + Math.max(0, batch.purityScore - 80) / 100;
  const sizeMultiplier = batch.quantity >= 100 ? 0.95 : batch.quantity >= 50 ? 1 : 1.08;
  const suggestedPricePerKg = Math.round(
    pricing.basePricePerKg * pricing.floralRarity * purityMultiplier * sizeMultiplier,
  );

  return {
    batchId: batch.id,
    batch,
    suggestedPricePerKg,
    totalBatchValue: Math.round(suggestedPricePerKg * Number(batch.quantity)),
    currency: 'INR',
    formula: {
      purityScore: batch.purityScore,
      floralRarity: pricing.floralRarity,
      batchSizeKg: Number(batch.quantity),
      basePricePerKg: pricing.basePricePerKg,
      purityMultiplier: Number(purityMultiplier.toFixed(2)),
      sizeMultiplier,
    },
    market: {
      reference: pricing.marketReference,
      range: pricing.marketRange,
      note: 'Indicative Indian wholesale reference data for demonstration purposes.',
    },
  };
}

router.get('/', (req, res) => {
  const batchId = req.query.batchId || db.getAllBatches()[0]?.id;
  const suggestion = batchId && getSuggestion(batchId);
  if (!suggestion) return res.status(404).json({ error: 'Fair price data not found' });
  res.json(suggestion);
});

router.get('/:batchId', (req, res) => {
  const suggestion = getSuggestion(req.params.batchId);
  if (!suggestion) return res.status(404).json({ error: 'Fair price data not found' });
  res.json(suggestion);
});

module.exports = router;