
import { http, HttpResponse } from 'msw';
import { NewsDigest } from '@/types/news';

// Store for the digest data
let currentDigest: NewsDigest | null = null;

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
currentDigest = fallbackDigest;

export const handlers = [
  // Health check endpoint
  http.get('*/health', () => {
    return HttpResponse.json({ status: 'ok', service: 'news-digest-mock' });
  }),

  // Get today's digest
  http.get('*/api/get-today', () => {
    if (!currentDigest) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(currentDigest);
  }),

  // Save digest (webhook endpoint for n8n)
  http.post('*/api/news', async ({ request }) => {
    try {
      const digest = await request.json() as NewsDigest;
      
      // Validate the structure
      if (!digest.date || !digest.categories) {
        return new HttpResponse(null, { status: 400 });
      }

      // Update the current digest
      currentDigest = {
        ...digest,
        date: digest.date || new Date().toISOString().split('T')[0]
      };

      console.log('📧 Webhook recibido - Digest actualizado:', currentDigest);
      
      return HttpResponse.json({ 
        status: 'success', 
        message: 'Digest guardado correctamente',
        date: currentDigest.date 
      });
    } catch (error) {
      console.error('❌ Error procesando webhook:', error);
      return new HttpResponse(null, { status: 400 });
    }
  }),

  // Test connection endpoint
  http.post('*/api/test-connection', async ({ request }) => {
    const data = await request.json();
    console.log('🧪 Test connection received:', data);
    
    return HttpResponse.json({
      status: 'success',
      message: 'Conexión exitosa con MSW',
      received: data,
      timestamp: new Date().toISOString()
    });
  }),

  // Status endpoint
  http.get('*/api/status', () => {
    return HttpResponse.json({
      status: 'online',
      service: 'msw-mock-server',
      digest_available: !!currentDigest,
      last_updated: currentDigest?.date || null
    });
  }),
];
