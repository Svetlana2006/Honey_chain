/**
 * ledger.js — Custom hash-chain implementation.
 *
 * HOW IT WORKS:
 *   Each "block" in the chain contains:
 *     - batchId       : unique ID of the honey batch
 *     - data          : the key fields that were hashed (quantity, location, date, beekeeperName)
 *     - timestamp     : ISO string of when the block was added
 *     - previousHash  : hash of the previous block (or "GENESIS" for the first)
 *     - hash          : SHA-256( batchId + JSON(data) + timestamp + previousHash )
 *
 *   To verify integrity we re-hash every block and confirm:
 *     1. block.hash === recomputed hash
 *     2. block.previousHash === previous block's hash
 *
 *   If either check fails the chain is "broken" at that block — this is the tamper-detection demo.
 */

const crypto = require('crypto');
const db     = require('./db');

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Compute a SHA-256 hash of a block's content.
 * @param {string} batchId
 * @param {object} data        — fields committed to the chain
 * @param {string} timestamp
 * @param {string} previousHash
 * @returns {string} hex digest
 */
function computeHash(batchId, data, timestamp, previousHash) {
  const content = batchId + JSON.stringify(data) + timestamp + previousHash;
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Add a new batch to the ledger (called after batch registration).
 * @param {object} batch — the newly registered batch object
 * @returns {object} the ledger block created
 */
function addToLedger(batch) {
  const ledger = db.getLedger();

  // Get previous hash (chain the blocks)
  const previousHash = ledger.length === 0
    ? GENESIS_HASH
    : ledger[ledger.length - 1].hash;

  const timestamp = new Date().toISOString();

  // Only commit core fields to the chain — this is what we protect
  const committedData = {
    quantity:      batch.quantity,
    location:      batch.location,
    harvestDate:   batch.harvestDate,
    beekeeperName: batch.beekeeperName,
    hiveId:        batch.hiveId,
    purityScore:   batch.purityScore,
  };

  const hash = computeHash(batch.id, committedData, timestamp, previousHash);

  const block = {
    blockIndex:   ledger.length,
    batchId:      batch.id,
    data:         committedData,
    timestamp,
    previousHash,
    hash,
  };

  db.appendLedgerBlock(block);
  return block;
}

/**
 * Verify the entire chain from genesis.
 * Returns an array of verification results — one per block.
 * Each result: { blockIndex, batchId, valid: bool, reason: string }
 */
function verifyChain() {
  const ledger  = db.getLedger();
  const batches = db.getAllBatches();

  const results = [];

  for (let i = 0; i < ledger.length; i++) {
    const block = ledger[i];
    const issues = [];

    // 1. Check previousHash linkage
    const expectedPrevHash = i === 0 ? GENESIS_HASH : ledger[i - 1].hash;
    if (block.previousHash !== expectedPrevHash) {
      issues.push('previousHash mismatch — chain broken before this block');
    }

    // 2. Re-hash and compare — catches field-level tampering in the DB
    const recomputed = computeHash(block.batchId, block.data, block.timestamp, block.previousHash);
    if (recomputed !== block.hash) {
      issues.push('block hash mismatch — block data has been altered');
    }

    // 3. Cross-check live batch data against committed chain data
    const liveBatch = batches.find(b => b.id === block.batchId);
    if (liveBatch) {
      const liveCommittable = {
        quantity:      liveBatch.quantity,
        location:      liveBatch.location,
        harvestDate:   liveBatch.harvestDate,
        beekeeperName: liveBatch.beekeeperName,
        hiveId:        liveBatch.hiveId,
        purityScore:   liveBatch.purityScore,
      };
      if (JSON.stringify(liveCommittable) !== JSON.stringify(block.data)) {
        issues.push('live batch data does not match committed chain data — TAMPERED');
      }
    } else {
      issues.push('batch record missing from database');
    }

    results.push({
      blockIndex: block.blockIndex,
      batchId:    block.batchId,
      valid:      issues.length === 0,
      issues,
    });
  }

  return results;
}

module.exports = { addToLedger, verifyChain, computeHash, GENESIS_HASH };
