# 🍯 Honey Chain

> KVIC Honey Traceability Platform — Tier 1 MVP

A tamper-proof honey traceability system with a custom hash-chain ledger, QR code generation, and a live tamper-detection demo.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in your browser
http://localhost:3000
```

---

## Pages

| URL | Purpose |
|-----|---------|
| `http://localhost:3000/` | **Beekeeper registration** — fill the batch form, get a QR code instantly |
| `http://localhost:3000/ledger.html` | **Ledger & Tamper Demo** — view the full chain; use the admin panel to tamper a record and watch the chain break |
| `http://localhost:3000/verify.html?id=<batchId>` | **Consumer verification** — full batch journey, purity score, trust grade, chain status |

---

## Demo Flow (for judges)

1. **Register a batch** on `index.html` → a QR is generated.
2. **Open `ledger.html`** → see the block appear on the chain, status: ✅ INTACT.
3. **Use the Tamper Panel** (right side):
   - Select the batch you just registered.
   - Change `quantity` to `999`.
   - Click **Execute Tamper**.
4. The page re-verifies immediately → block turns **red**, chain banner flashes 🚨.
5. **Scan the QR** (or open the verify link) → the consumer page shows the big red **"WARNING: Tampering Detected!"** badge.

---

## File Structure

```
Honey_chain/
├── backend/
│   ├── server.js          # Express server — serves frontend + API
│   ├── db.js              # JSON file-based storage (no external DB)
│   ├── ledger.js          # Hash-chain logic + verification
│   └── routes/
│       ├── batches.js     # POST/GET /api/batches, POST /api/batches/:id/tamper
│       └── ledger.js      # GET /api/ledger, GET /api/ledger/verify
├── frontend/
│   ├── style.css          # Shared design system
│   ├── index.html         # Batch registration form
│   ├── ledger.html        # Chain viewer + tamper demo
│   └── verify.html        # Consumer QR scan page
├── data/                  # Auto-created on first run
│   ├── batches.json       # Off-chain batch metadata
│   ├── ledger.json        # The hash chain
│   └── photos/            # Uploaded batch photos
└── plan.md
```

---

## API Reference

### Batch Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/batches` | Register new batch (multipart form with optional photo) |
| `GET`  | `/api/batches` | List all batches |
| `GET`  | `/api/batches/:id` | Get one batch + its ledger block |
| `POST` | `/api/batches/:id/tamper` | **Demo only** — edit a field without updating the ledger |

**Tamper body:**
```json
{ "field": "quantity", "newValue": "999" }
```

### Ledger Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/ledger` | Full raw chain (all blocks) |
| `GET` | `/api/ledger/verify` | Run integrity check — returns per-block valid/invalid status |

---

## How the Hash Chain Works

Each block stores:
- `batchId` — references the batch
- `data` — core fields committed to the chain (quantity, location, date, beekeeper name, hive ID, purity score)
- `timestamp`
- `previousHash` — links to the previous block
- `hash` — SHA-256 of all the above

**Tamper detection runs three checks:**
1. Re-hash the block and compare → catches anyone editing `ledger.json` directly
2. Check `previousHash` linkage → catches block deletion/insertion
3. Cross-compare live DB record vs committed chain data → **this is what the demo triggers**

The tamper endpoint writes only to `batches.json` (the "database"), not to `ledger.json` (the "chain") — exactly simulating what a bad actor would do.
