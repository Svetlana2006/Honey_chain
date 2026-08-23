/**
 * server.js — Entry point for the Honey Chain backend.
 *
 * Starts an Express server that:
 *   - Serves the /frontend directory as static files (HTML/CSS/JS pages)
 *   - Serves uploaded photos from /data/photos/
 *   - Mounts the batch and ledger API routes
 *
 * Run with:  node packages/api/server.js   (from root)
 * Or:        npm run dev --workspace=@honey-chain/api
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const batchRoutes  = require('./routes/batches');
const ledgerRoutes = require('./routes/ledger');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---- Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Static file serving ----

// Serve uploaded honey-batch photos at /photos/<filename>
app.use('/photos', express.static(path.join(__dirname, '..', '..', 'data', 'photos')));

// ---- API Routes ----
app.use('/api/batches', batchRoutes);
app.use('/api/ledger',  ledgerRoutes);

// ---- API Fallback ----
app.all('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`\n🍯 Honey Chain API server running at http://localhost:${PORT}`);
  console.log(`   (Use Vite dev server at http://localhost:5173 for frontend)\n`);
});
