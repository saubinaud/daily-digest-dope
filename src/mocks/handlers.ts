
import { http, HttpResponse } from 'msw';
import { NewsDigest } from '@/types/news';

// TTL Store for MSW (simulating backend behavior)
class TTLStore<T> {
  private data = new Map<string, { value: T; expiresAt: number }>();
  
  constructor(private ttlMs: number) {}
  
  set(key: string, value: T) {
    this.data.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });
  }
  
  get(key: string): T | null {
    const entry = this.data.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.data.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  clear(key: string) {
    this.data.delete(key);
  }
}

// 24 hours TTL store for MSW
const mockStore = new TTLStore<NewsDigest>(24 * 60 * 60 * 1000);

// Default fallback data
const fallbackDigest: NewsDigest = {
  date: new Date().toISOString().split('T')[0],
  categories: {
    IA: {
      insight: "La inteligencia artificial continúa transformando industrias con avances significativos en procesamiento de lenguaje natural y automatización.",
      articles: [
        {
          rank: 1,
          title: "OpenAI lanza GPT-5 con capacidades multimodales mejoradas",
          summary: "La nueva versión del modelo de lenguaje incluye mejor comprensión de imágenes, video y audio, marcando un hito en la evolución de la IA conversacional.",
          context: "Este lanzamiento representa un avance significativo en la capacidad de procesamiento multimodal de la IA.",
          reliability: 5
        }
      ]
    },
    Marketing: {
      insight: "El marketing digital evoluciona hacia estrategias más personalizadas y basadas en datos.",
      articles: [
        {
          rank: 1,
          title: "TikTok introduce nuevas herramientas de comercio social",
          summary: "La plataforma lanza funciones avanzadas para creadores y marcas.",
          context: "Estas herramientas representan la evolución del social commerce.",
          reliability: 4
        }
      ]
    },
    Bolsa: {
      insight: "Los mercados muestran volatilidad moderada con tendencias alcistas en el sector tecnológico.",
      articles: [
        {
          rank: 1,
          title: "Las acciones de NVIDIA alcanzan máximos históricos",
          summary: "El fabricante de chips registra ganancias del 15% en la sesión.",
          context: "El crecimiento de NVIDIA refleja la creciente demanda de hardware para IA.",
          reliability: 5
        }
      ]
    },
    Internacional: {
      insight: "La geopolítica global se mantiene en un estado de transformación.",
      articles: [
        {
          rank: 1,
          title: "Cumbre climática COP29 alcanza acuerdos históricos",
          summary: "Los líderes mundiales firman compromisos vinculantes para reducir emisiones.",
          context: "Este acuerdo representa el consenso más amplio alcanzado en décadas.",
          reliability: 5
        }
      ]
    }
  }
};

// Initialize with fallback data
mockStore.set('today', fallbackDigest);

// Helper function to normalize payload (same logic as backend)
const normalizeToNewsDigest = (payload: any): NewsDigest => {
  // Check if it's already in NewsDigest format
  if (payload.categories && typeof payload.categories === 'object') {
    console.log('📦 MSW: Payload is already in NewsDigest format');
    return {
      date: payload.date || new Date().toISOString().split('T')[0],
      categories: payload.categories
    };
  }

  // Simplified format - normalize to NewsDigest
  console.log('🔄 MSW: Converting simplified payload to NewsDigest format');
  
  const categoryName = payload.category || 'IA';
  const mappedCategory = categoryName === 'Technology' ? 'IA' : 
                         categoryName === 'Finance' ? 'Bolsa' : 
                         categoryName === 'Business' ? 'Marketing' : 
                         categoryName === 'Global' ? 'Internacional' : 
                         'IA'; // Default fallback

  // Convert reliability from 0-1 to 1-5 scale
  const normalizedArticles = (payload.articles || []).map((article: any) => ({
    rank: article.rank || 1,
    title: article.title || 'Sin título',
    summary: article.summary || 'Sin resumen',
    context: article.context || '',
    reliability: Math.round((article.reliability || 0.5) * 5) || 3
  }));

  // Create full NewsDigest structure
  const newsDigest: NewsDigest = {
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

export const handlers = [
  // Health check endpoint
  http.get('*/health', () => {
    return HttpResponse.json({ 
      status: 'Server is running', 
      timestamp: new Date().toISOString() 
    });
  }),

  // Get today's digest with TTL
  http.get('*/api/get-today', () => {
    const digest = mockStore.get('today');
    
    if (!digest) {
      console.log('❌ MSW: No digest found in TTL store (expired or never set)');
      return HttpResponse.json(
        { 
          error: 'No digest available',
          message: 'No digest available or digest has expired (24h TTL). Please send a new digest via POST /api/news'
        }, 
        { status: 404 }
      );
    }
    
    console.log('✅ MSW: Digest retrieved successfully from TTL store');
    return HttpResponse.json({
      ...digest,
      _metadata: {
        source: 'msw-ttl-store',
        retrievedAt: new Date().toISOString()
      }
    });
  }),

  // Save digest (webhook endpoint for n8n) - supports both formats
  http.post('*/api/news', async ({ request }) => {
    try {
      const payload = await request.json() as any;
      
      console.log('🔄 MSW: Processing digest...', payload);

      // Validate basic structure
      if (!payload || typeof payload !== 'object') {
        return HttpResponse.json(
          { error: 'Invalid payload structure' }, 
          { status: 400 }
        );
      }

      // Normalize payload to NewsDigest format
      const normalizedDigest = normalizeToNewsDigest(payload);
      
      // Update the store with TTL
      mockStore.set('today', normalizedDigest);

      console.log('✅ MSW: Digest saved successfully with TTL');
      
      return HttpResponse.json({ 
        status: 'success', 
        message: 'Digest saved successfully with 24h TTL (MSW)',
        timestamp: new Date().toISOString(),
        stats: {
          categories: Object.keys(normalizedDigest.categories).length,
          totalArticles: Object.values(normalizedDigest.categories).reduce((acc, cat) => acc + cat.articles.length, 0)
        }
      });
    } catch (error) {
      console.error('❌ MSW: Error processing webhook:', error);
      return HttpResponse.json(
        { error: 'Invalid JSON payload' }, 
        { status: 400 }
      );
    }
  }),

  // Test connection endpoint
  http.post('*/api/test-connection', async ({ request }) => {
    const data = await request.json();
    console.log('🧪 MSW: Test connection received:', data);
    
    return HttpResponse.json({
      status: 'success',
      message: 'Connection test successful (MSW)',
      received: data,
      timestamp: new Date().toISOString(),
      supportedFormats: [
        'Simplified: { category, insight, articles[] }',
        'NewsDigest: { date, categories: { IA, Marketing, Bolsa, Internacional } }'
      ]
    });
  }),

  // Status endpoint
  http.get('*/api/status', () => {
    const hasDigest = !!mockStore.get('today');
    
    return HttpResponse.json({
      status: 'running',
      service: 'msw-mock-server',
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
  }),
];
