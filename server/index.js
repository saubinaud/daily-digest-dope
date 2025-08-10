
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// TTL Store implementation
class TTLStore {
  constructor(ttlMs) {
    this.data = new Map();
    this.ttlMs = ttlMs;
  }

  set(key, value) {
    this.data.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });
  }

  get(key) {
    const entry = this.data.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.data.delete(key);
      return null;
    }
    
    return entry.value;
  }

  clear(key) {
    this.data.delete(key);
  }
}

// 24 hours TTL store
const digestStore = new TTLStore(24 * 60 * 60 * 1000);

// Enhanced CORS configuration for n8n, Lovable, and local development
const corsOptions = {
  origin: [
    // Local development
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    
    // Lovable preview domains
    /\.lovable\.app$/,
    /\.lovableproject\.com$/,
    
    // n8n Cloud domains
    'https://app.n8n.cloud',
    /\.n8n\.cloud$/,
    
    // Any localhost for development
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

// Enhanced request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const origin = req.get('Origin') || 'unknown';
  console.log(`🔄 ${timestamp} - ${req.method} ${req.path} from ${origin}`);
  
  if (req.method === 'POST') {
    const bodyPreview = JSON.stringify(req.body, null, 2).substring(0, 300);
    console.log('📝 Request body preview:', bodyPreview + (bodyPreview.length >= 300 ? '...' : ''));
  }
  next();
});

// Helper function to normalize payload to NewsDigest format
const normalizeToNewsDigest = (payload) => {
  // Check if it's already in NewsDigest format (has categories object)
  if (payload.categories && typeof payload.categories === 'object') {
    console.log('📦 Payload is already in NewsDigest format');
    return {
      date: payload.date || new Date().toISOString().split('T')[0],
      categories: payload.categories
    };
  }

  // Simplified format - normalize to NewsDigest
  console.log('🔄 Converting simplified payload to NewsDigest format');
  
  const categoryName = payload.category || 'IA';
  const mappedCategory = categoryName === 'Technology' ? 'IA' : 
                         categoryName === 'Finance' ? 'Bolsa' : 
                         categoryName === 'Business' ? 'Marketing' : 
                         categoryName === 'Global' ? 'Internacional' : 
                         'IA'; // Default fallback

  // Convert reliability from 0-1 to 1-5 scale
  const normalizedArticles = (payload.articles || []).map(article => ({
    rank: article.rank || 1,
    title: article.title || 'Sin título',
    summary: article.summary || 'Sin resumen',
    context: article.context || '',
    reliability: Math.round((article.reliability || 0.5) * 5) || 3 // Convert 0-1 to 1-5
  }));

  // Create full NewsDigest structure
  const newsDigest = {
    date: new Date().toISOString().split('T')[0],
    categories: {
      IA: {
        insight: mappedCategory === 'IA' ? (payload.insight || 'Avances en inteligencia artificial') : 'Sin información disponible',
        articles: mappedCategory === 'IA' ? normalizedArticles : []
      },
      Marketing: {
        insight: mappedCategory === 'Marketing' ? (payload.insight || 'Tendencias en marketing digital') : 'Sin información disponible',
        articles: mappedCategory === 'Marketing' ? normalizedArticles : []
      },
      Bolsa: {
        insight: mappedCategory === 'Bolsa' ? (payload.insight || 'Movimientos en los mercados') : 'Sin información disponible',
        articles: mappedCategory === 'Bolsa' ? normalizedArticles : []
      },
      Internacional: {
        insight: mappedCategory === 'Internacional' ? (payload.insight || 'Eventos internacionales relevantes') : 'Sin información disponible',
        articles: mappedCategory === 'Internacional' ? normalizedArticles : []
      }
    }
  };

  return newsDigest;
};

// Helper function to validate digest structure
const isValidDigest = (data) => {
  if (!data || typeof data !== 'object') {
    console.log('❌ Invalid digest: not an object');
    return false;
  }

  // For simplified format
  if (data.category && data.articles) {
    console.log('✅ Valid simplified digest format');
    return true;
  }

  // For NewsDigest format
  if (!data.categories || typeof data.categories !== 'object') {
    console.log('❌ Invalid digest: missing or invalid categories');
    return false;
  }

  console.log('✅ Valid NewsDigest format');
  return true;
};

// POST /api/news - Save digest from n8n (supports both formats)
app.post('/api/news', (req, res) => {
  console.log('🔄 Processing digest from n8n...');
  console.log('📦 Full request body:', JSON.stringify(req.body, null, 2));

  // Validate the digest structure
  if (!isValidDigest(req.body)) {
    console.log('❌ Digest validation failed');
    return res.status(400).json({ 
      error: 'Invalid digest structure',
      message: 'The digest must be either simplified format (category, insight, articles) or full NewsDigest format'
    });
  }

  // Normalize payload to NewsDigest format
  const normalizedDigest = normalizeToNewsDigest(req.body);
  
  // Save the normalized digest with TTL
  digestStore.set('today', normalizedDigest);
  
  console.log('✅ Digest saved successfully with TTL');
  console.log('📊 Digest stats:', {
    date: normalizedDigest.date,
    categories: Object.keys(normalizedDigest.categories),
    totalArticles: Object.values(normalizedDigest.categories).reduce((acc, cat) => acc + cat.articles.length, 0)
  });

  return res.status(200).json({ 
    status: 'success',
    message: 'Digest saved successfully with 24h TTL',
    timestamp: new Date().toISOString(),
    stats: {
      categories: Object.keys(normalizedDigest.categories).length,
      totalArticles: Object.values(normalizedDigest.categories).reduce((acc, cat) => acc + cat.articles.length, 0)
    }
  });
});

// Enhanced GET /api/get-today - Get saved digest with TTL check
app.get('/api/get-today', (req, res) => {
  console.log('🔍 Fetching digest from TTL store...');
  console.log('📍 Request origin:', req.get('Origin'));
  
  const digest = digestStore.get('today');
  if (digest) {
    console.log('✅ Digest retrieved successfully from TTL store');
    console.log('📅 Digest date:', digest.date);
    
    return res.status(200).json({
      ...digest,
      _metadata: {
        source: 'ttl-store',
        retrievedAt: new Date().toISOString()
      }
    });
  }
  
  console.log('❌ No digest found in TTL store (expired or never set)');
  return res.status(404).json({ 
    error: 'No digest available',
    message: 'No digest available or digest has expired (24h TTL). Please send a new digest via POST /api/news'
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
    receivedData: req.body,
    supportedFormats: [
      'Simplified: { category, insight, articles[] }',
      'NewsDigest: { date, categories: { IA, Marketing, Bolsa, Internacional } }'
    ]
  });
});

// GET /api/status - Server status
app.get('/api/status', (req, res) => {
  const hasDigest = !!digestStore.get('today');
  
  res.status(200).json({
    status: 'running',
    hasDigest,
    digestExpired: !hasDigest,
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /api/news': 'Receive digest from n8n (both formats supported)',
      'GET /api/get-today': 'Get current digest (24h TTL)',
      'POST /api/test-connection': 'Test n8n connection',
      'GET /api/status': 'Server status'
    },
    supportedPayloadFormats: {
      simplified: {
        category: 'string (Technology, Finance, Business, Global)',
        insight: 'string',
        articles: '[{rank, title, summary, context?, reliability: 0-1}]'
      },
      newsDigest: {
        date: 'string (ISO)',
        categories: 'object with IA, Marketing, Bolsa, Internacional'
      }
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
  console.log(`🌐 Server ready for deployment to services like Render, Railway, or Vercel`);
  console.log(`📊 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/news - Receive digest from n8n (both formats)`);
  console.log(`   GET  http://localhost:${PORT}/api/get-today - Get current digest (24h TTL)`);
  console.log(`   POST http://localhost:${PORT}/api/test-connection - Test n8n connection`);
  console.log(`   GET  http://localhost:${PORT}/api/status - Server status`);
  console.log(`   GET  http://localhost:${PORT}/health - Health check`);
  console.log(`\n🔗 Ready to receive data from n8n! (supports both simplified and NewsDigest formats)`);
  console.log(`💡 To deploy: Push to GitHub and connect to Render/Railway/Vercel`);
});
