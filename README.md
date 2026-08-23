# 🍯 Honey Chain

> KVIC Honey Traceability Platform — Tier 1 MVP

A tamper-proof honey traceability system with a custom hash-chain ledger, QR code generation, and a live tamper-detection demo built with **React (Vite), Tailwind CSS v3, and an Express API Backend.**

---

## Quick Start (Localhost Development)

To run the full application locally, you will need to start both the backend API server and the frontend Vite development server in **two separate terminal windows**.

### Terminal 1: Start the Backend (API Server)
```bash
# Make sure you are in the root directory (Honey_chain)
node backend/server.js
```
*The backend will now be running on `http://localhost:3000`.*

### Terminal 2: Start the Frontend (React/Vite Server)
```bash
# Navigate to the client directory
cd client

# Install frontend dependencies (only needed the first time)
npm install

# Start the development server
npm run dev
```
*The frontend will now be running on `http://localhost:5173`.*

**👉 Open your browser to: [http://localhost:5173](http://localhost:5173) to view the application!**

---

## Navigation

| Route | Purpose |
|-----|---------|
| `http://localhost:5173/` | **Beekeeper registration** — fill out the batch form and generate a QR code instantly. |
| `http://localhost:5173/ledger` | **Live Ledger & Tamper Demo** — view the full cryptographic chain; use the admin panel to secretly tamper with a record and watch the chain visibly break. |
| `http://localhost:5173/verify?id=<batchId>` | **Consumer Verification** — scan a QR code to view the full batch journey, purity score, trust grade, and chain integrity status. |

---

## Demo Flow (for judges)

1. **Register a batch** on the home page (`http://localhost:5173/`) → a QR is generated.
2. **Open the Ledger** via the sidebar (`http://localhost:5173/ledger`) → see the block appear on the chain with a green "✅ Secure" status.
3. **Use the Tamper Panel** (on the right side of the Ledger):
   - Select the batch you just registered.
   - Choose a field to edit (e.g., `quantity`).
   - Enter a fake value (e.g., `999`).
   - Click **Execute Tamper**.
4. The page re-verifies immediately → the block turns **red**, the chain line visibly breaks, and the system explicitly logs the hash mismatch! 🚨
5. **Navigate to the Verification page** → the consumer page will now show a massive red **"WARNING: Tampering Detected!"** banner, preventing consumers from trusting the altered data.

---

## File Structure

```
Honey_chain/
├── backend/
│   ├── server.js          # Express API server (Port 3000)
│   ├── db.js              # JSON file-based database
│   ├── ledger.js          # Hash-chain logic + cryptographic verification
│   └── routes/
│       ├── batches.js     # API endpoints for batches and tampering
│       └── ledger.js      # API endpoints for ledger verification
├── client/                # React + Vite Frontend App
│   ├── index.html         # Application entry point
│   ├── vite.config.js     # Vite configuration (proxies /api to backend)
│   ├── tailwind.config.js # Tailwind CSS v3 configuration (Stitch UI)
│   └── src/
│       ├── App.jsx        # Main React Router setup
│       ├── global.css     # Tailwind base directives and custom animations
│       ├── pages/         # React pages (RegisterBatch, Ledger, Verify)
│       └── components/    # Reusable UI components (Sidebar, TopBar)
├── data/                  # Auto-created on first run
│   ├── batches.json       # Off-chain batch metadata
│   ├── ledger.json        # The hash chain
│   └── photos/            # Uploaded batch photos
└── plan.md                # Development roadmap
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

### Ledger Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/ledger` | Full raw chain (all blocks) |
| `GET` | `/api/ledger/verify` | Run integrity check — returns per-block valid/invalid status |

---

## How the Hash Chain Works

Each block stores:
- `batchId` — references the original batch.
- `data` — core fields committed to the chain (quantity, location, date, beekeeper name, hive ID, purity score).
- `timestamp`
- `previousHash` — links to the previous block.
- `hash` — SHA-256 cryptographic digest of all the above.

**Tamper detection runs three checks:**
1. Re-hash the block and compare → catches anyone editing `ledger.json` directly.
2. Check `previousHash` linkage → catches block deletion/insertion.
3. Cross-compare live DB record vs committed chain data → **this is what the demo triggers.**

The tamper endpoint writes only to `batches.json` (the "database"), not to `ledger.json` (the "chain") — exactly simulating what a bad actor would do if they hacked the main database!
