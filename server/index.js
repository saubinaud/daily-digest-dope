
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (lives while server instance is active)
globalThis.digestCache = null;

// POST /api/news - Save digest for 24h
app.post('/api/news', (req, res) => {
  // Save the digest received
  globalThis.digestCache = req.body;
  console.log('✅ Digest saved successfully');
  return res.status(200).json({ status: 'ok' });
});

// GET /api/get-today - Get saved digest
app.get('/api/get-today', (req, res) => {
  const digest = globalThis.digestCache;
  if (digest) {
    console.log('✅ Digest retrieved successfully');
    return res.status(200).json(digest);
  }
  console.log('❌ No digest found');
  return res.status(404).json({ error: 'No digest' });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/news`);
  console.log(`   GET  http://localhost:${PORT}/api/get-today`);
});
