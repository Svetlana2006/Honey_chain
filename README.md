# 🍯 Honey Chain

> KVIC Honey Traceability Platform — Turborepo Monorepo

A tamper-proof honey traceability system with a custom hash-chain ledger, QR code generation, and a live tamper-detection demo. Built with **React (Vite)**, **Express**, **Tailwind CSS v3**, and orchestrated by **Turborepo**.

---

## Quick Start

```bash
# 1. Clone and install (installs ALL workspace dependencies from root)
npm install

# 2. Run everything in parallel — one command, one terminal
npm run dev
```

**👉 Open: [http://localhost:5173](http://localhost:5173)**

> Turborepo starts the API (`localhost:3000`) and the Vite frontend (`localhost:5173`) in parallel automatically.

---

## Individual App Commands

```bash
npm run dev:api       # Start only the Express API (with nodemon)
npm run dev:client    # Start only the Vite frontend
npm run build         # Build all apps for production
npm run lint          # Lint all apps
```

---

## Navigation

| Route | Purpose |
|-----|---------|
| `http://localhost:5173/` | **Beekeeper Registration** — fill out the batch form and get a QR code instantly. |
| `http://localhost:5173/ledger` | **Live Ledger & Tamper Demo** — view the cryptographic chain; use the admin panel to secretly tamper with a record and watch the chain visibly break. |
| `http://localhost:5173/verify?id=<batchId>` | **Consumer Verification** — view full batch journey, purity score, trust grade, and chain integrity status. |

---

## Demo Flow (for judges)

1. **Register a batch** on the home page → a QR is generated.
2. **Open the Ledger** → see the block with a green ✅ "Secure" status.
3. **Use the Tamper Panel** (right side of Ledger page):
   - Select the batch → choose a field → enter a fake value → click **Execute Tamper**.
4. The chain **visibly breaks** → block turns red, hash mismatch is logged. 🚨
5. **Open the Verification page** → shows a red **"WARNING: Tampering Detected!"** banner.

---

## Monorepo Structure

```
Honey_chain/                   ← Turborepo workspace root
├── apps/
│   ├── api/                   ← @honey-chain/api (Express, Port 3000)
│   │   ├── server.js          # Entry point
│   │   ├── db.js              # JSON file-based storage
│   │   ├── ledger.js          # Hash-chain + cryptographic verification
│   │   └── routes/
│   │       ├── batches.js     # POST/GET /api/batches, /tamper
│   │       └── ledger.js      # GET /api/ledger, /verify
│   └── client/                ← @honey-chain/client (React + Vite, Port 5173)
│       ├── index.html
│       ├── vite.config.js     # Proxies /api → port 3000
│       ├── tailwind.config.js
│       └── src/
│           ├── App.jsx
│           ├── global.css
│           ├── pages/         # RegisterBatch, Ledger, Verify
│           └── components/    # Nav, UI helpers
├── packages/                  ← Shared libraries (future: @honey-chain/shared)
├── data/                      ← Runtime JSON storage (auto-created)
├── turbo.json                 ← Turborepo task pipeline
├── package.json               ← Workspace root + scripts
└── .gitignore
```

---

## API Reference

### Batch Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/batches` | Register new batch (multipart form + optional photo) |
| `GET`  | `/api/batches` | List all batches |
| `GET`  | `/api/batches/:id` | Get one batch + its ledger block |
| `POST` | `/api/batches/:id/tamper` | **Demo only** — tamper a field without updating the ledger |

### Ledger Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/ledger` | Full raw chain |
| `GET` | `/api/ledger/verify` | Per-block integrity check |

---

## How the Hash Chain Works

Each block commits: `batchId`, `data` (quantity, location, date, beekeeper, hive ID, purity score), `timestamp`, `previousHash`, and `hash` (SHA-256 of all the above).

**Three-layer tamper detection:**
1. Re-hash each block → catches direct edits to `ledger.json`
2. Validate `previousHash` chain linkage → catches block insertion/deletion
3. Cross-compare live DB vs committed data → **this is what the demo triggers**
