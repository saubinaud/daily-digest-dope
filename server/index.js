
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration for n8n
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000', 
    'https://app.n8n.cloud',
    /\.n8n\.cloud$/,
    /localhost/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🔄 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST') {
    console.log('📝 Request body preview:', JSON.stringify(req.body, null, 2).substring(0, 500));
  }
  next();
});

// In-memory storage (lives while server instance is active)
globalThis.digestCache = null;
globalThis.lastUpdate = null;

// Helper function to validate digest structure
const isValidDigest = (data) => {
  if (!data || typeof data !== 'object') {
    console.log('❌ Invalid digest: not an object');
    return false;
  }

  if (!data.date || typeof data.date !== 'string') {
    console.log('❌ Invalid digest: missing or invalid date');
    return false;
  }

  if (!data.categories || typeof data.categories !== 'object') {
    console.log('❌ Invalid digest: missing or invalid categories');
    return false;
  }

  const requiredCategories = ['IA', 'Marketing', 'Bolsa', 'Internacional'];
  for (const category of requiredCategories) {
    if (!data.categories[category]) {
      console.log(`❌ Invalid digest: missing category ${category}`);
      return false;
    }
    
    const cat = data.categories[category];
    if (!cat.insight || typeof cat.insight !== 'string') {
      console.log(`❌ Invalid digest: missing insight for ${category}`);
      return false;
    }
    
    if (!Array.isArray(cat.articles)) {
      console.log(`❌ Invalid digest: invalid articles array for ${category}`);
      return false;
    }

    for (const article of cat.articles) {
      if (!article.title || !article.summary || !article.context) {
        console.log(`❌ Invalid digest: missing required fields in article for ${category}`);
        return false;
      }
      if (typeof article.rank !== 'number' || typeof article.reliability !== 'number') {
        console.log(`❌ Invalid digest: invalid numeric fields in article for ${category}`);
        return false;
      }
    }
  }

  console.log('✅ Digest structure validation passed');
  return true;
};

// POST /api/news - Save digest from n8n
app.post('/api/news', (req, res) => {
  console.log('🔄 Processing digest from n8n...');
  console.log('📦 Full request body:', JSON.stringify(req.body, null, 2));

  // Validate the digest structure
  if (!isValidDigest(req.body)) {
    console.log('❌ Digest validation failed');
    return res.status(400).json({ 
      error: 'Invalid digest structure',
      message: 'The digest must contain date, categories (IA, Marketing, Bolsa, Internacional) with insights and articles'
    });
  }

  // Save the digest
  globalThis.digestCache = req.body;
  globalThis.lastUpdate = new Date().toISOString();
  
  console.log('✅ Digest saved successfully from n8n');
  console.log('📊 Digest stats:', {
    date: req.body.date,
    categories: Object.keys(req.body.categories),
    totalArticles: Object.values(req.body.categories).reduce((acc, cat) => acc + cat.articles.length, 0)
  });

  return res.status(200).json({ 
    status: 'success',
    message: 'Digest saved successfully',
    timestamp: globalThis.lastUpdate,
    stats: {
      categories: Object.keys(req.body.categories).length,
      totalArticles: Object.values(req.body.categories).reduce((acc, cat) => acc + cat.articles.length, 0)
    }
  });
});

// GET /api/get-today - Get saved digest
app.get('/api/get-today', (req, res) => {
  console.log('🔍 Fetching digest...');
  
  const digest = globalThis.digestCache;
  if (digest) {
    console.log('✅ Digest retrieved successfully');
    console.log('📅 Digest date:', digest.date);
    console.log('🕐 Last update:', globalThis.lastUpdate);
    
    return res.status(200).json({
      ...digest,
      _metadata: {
        lastUpdate: globalThis.lastUpdate,
        source: 'n8n'
      }
    });
  }
  
  console.log('❌ No digest found in cache');
  return res.status(404).json({ 
    error: 'No digest available',
    message: 'No digest has been received from n8n yet'
  });
});

// POST /api/test-connection - Test endpoint for n8n
app.post('/api/test-connection', (req, res) => {
  console.log('🧪 Test connection from n8n');
  console.log('📝 Test data received:', req.body);
  
  res.status(200).json({
    status: 'success',
    message: 'Connection test successful',
    timestamp: new Date().toISOString(),
    receivedData: req.body
  });
});

// GET /api/status - Server status
app.get('/api/status', (req, res) => {
  const hasDigest = !!globalThis.digestCache;
  
  res.status(200).json({
    status: 'running',
    hasDigest,
    lastUpdate: globalThis.lastUpdate,
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /api/news': 'Receive digest from n8n',
      'GET /api/get-today': 'Get current digest',
      'POST /api/test-connection': 'Test n8n connection',
      'GET /api/status': 'Server status'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❓ 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    error: 'Route not found',
    availableEndpoints: [
      'POST /api/news',
      'GET /api/get-today', 
      'POST /api/test-connection',
      'GET /api/status',
      'GET /health'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 News Digest API Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/news - Receive digest from n8n`);
  console.log(`   GET  http://localhost:${PORT}/api/get-today - Get current digest`);
  console.log(`   POST http://localhost:${PORT}/api/test-connection - Test n8n connection`);
  console.log(`   GET  http://localhost:${PORT}/api/status - Server status`);
  console.log(`   GET  http://localhost:${PORT}/health - Health check`);
  console.log(`\n🔗 Ready to receive data from n8n!`);
});
