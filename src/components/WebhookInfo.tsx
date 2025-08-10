
import { useState } from 'react';
import { Copy, ExternalLink, Zap, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const WebhookInfo = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'simplified' | 'newsdigest'>('simplified');
  
  // Get the current app URL for the webhook
  const webhookUrl = `${window.location.origin}/api/news`;
  const isDemoMode = !import.meta.env.VITE_API_BASE_URL;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: "Contenido copiado al portapapeles",
    });
  };

  // Simplified payload format (new)
  const simplifiedPayload = {
    category: "Technology",
    insight: "Open-source momentum keeps growing across the tech industry",
    Type: "daily",
    articles: [
      {
        rank: 1,
        title: "Meta open-sources new AI model",
        summary: "The company released a new large language model with improved capabilities for code generation and reasoning.",
        context: "This represents Meta's continued commitment to open-source AI development.",
        reliability: 0.92,
        Type: "news"
      },
      {
        rank: 2,
        title: "GitHub launches new collaboration tools",
        summary: "Enhanced features for team development and project management are now available.",
        context: "GitHub continues to evolve as the primary platform for software development.",
        reliability: 0.88,
        Type: "announcement"
      }
    ]
  };

  // NewsDigest payload format (current)
  const newsDigestPayload = {
    date: "2024-01-15",
    categories: {
      IA: {
        insight: "AI development accelerates with new breakthroughs",
        articles: [{
          rank: 1,
          title: "New AI model achieves human-level performance",
          summary: "Latest research shows significant improvements in reasoning capabilities.",
          context: "This breakthrough could revolutionize how we interact with AI systems.",
          reliability: 5
        }]
      },
      Marketing: {
        insight: "Digital marketing trends shift towards personalization",
        articles: [{
          rank: 1,
          title: "AI-powered marketing automation gains traction",
          summary: "Companies increasingly adopt AI for personalized customer experiences.",
          context: "This trend reflects the growing importance of data-driven marketing.",
          reliability: 4
        }]
      },
      Bolsa: {
        insight: "Tech stocks show resilience despite market volatility",
        articles: [{
          rank: 1,
          title: "NVIDIA shares reach new heights",
          summary: "Strong AI demand drives continued growth in semiconductor stocks.",
          context: "The AI boom continues to benefit hardware manufacturers.",
          reliability: 5
        }]
      },
      Internacional: {
        insight: "Global cooperation on AI governance increases",
        articles: [{
          rank: 1,
          title: "International AI safety summit concludes",
          summary: "World leaders agree on framework for responsible AI development.",
          context: "This represents a milestone in global AI governance efforts.",
          reliability: 5
        }]
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="glass-card p-3 rounded-full text-news-accent hover:bg-news-accent/10 transition-all duration-300 shadow-lg"
      >
        <Zap className="w-6 h-6" />
      </button>
      
      {showDetails && (
        <div className="absolute bottom-16 right-0 w-[480px] glass-card rounded-2xl p-6 shadow-xl animate-fade-in max-h-[80vh] overflow-y-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-news-accent/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-news-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Webhook n8n</h3>
              <p className="text-sm text-text-secondary">URL de conexión</p>
            </div>
          </div>

          {isDemoMode && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800 font-medium">Modo Demo (MSW)</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Para uso en producción, despliega el backend y configura VITE_API_BASE_URL
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                URL del webhook:
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-surface-tertiary text-xs p-2 rounded border text-text-primary font-mono">
                  {webhookUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(webhookUrl)}
                  className="p-2 hover:bg-surface-tertiary rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>
            
            <div className="text-xs text-text-secondary space-y-1">
              <p><strong>Método:</strong> POST</p>
              <p><strong>Content-Type:</strong> application/json</p>
              <p><strong>TTL:</strong> 24 horas</p>
            </div>

            <div className="border-t border-border pt-4">
              <label className="text-sm font-medium text-text-primary mb-3 block">
                Formato de payload:
              </label>
              
              <div className="flex space-x-2 mb-3">
                <button
                  onClick={() => setSelectedFormat('simplified')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedFormat === 'simplified' 
                      ? 'bg-news-accent text-white' 
                      : 'bg-surface-tertiary text-text-secondary'
                  }`}
                >
                  Simplificado (Recomendado)
                </button>
                <button
                  onClick={() => setSelectedFormat('newsdigest')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedFormat === 'newsdigest' 
                      ? 'bg-news-accent text-white' 
                      : 'bg-surface-tertiary text-text-secondary'
                  }`}
                >
                  NewsDigest (Completo)
                </button>
              </div>

              <div className="bg-surface-tertiary rounded p-3 max-h-64 overflow-y-auto">
                <pre className="text-xs text-text-primary font-mono">
                  {JSON.stringify(
                    selectedFormat === 'simplified' ? simplifiedPayload : newsDigestPayload, 
                    null, 
                    2
                  )}
                </pre>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2 border-t border-border">
              <button
                onClick={() => copyToClipboard(JSON.stringify(
                  selectedFormat === 'simplified' ? simplifiedPayload : newsDigestPayload, 
                  null, 
                  2
                ))}
                className="flex-1 text-xs bg-news-accent text-white px-3 py-2 rounded hover:bg-news-accent/80 transition-colors"
              >
                Copiar JSON de ejemplo
              </button>
              <a
                href="https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httpRequest/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-text-secondary hover:text-news-accent transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {selectedFormat === 'simplified' && (
              <div className="text-xs text-text-secondary bg-blue-50 p-2 rounded">
                <strong>Formato Simplificado:</strong> Envía solo una categoría por request. 
                Las categorías soportadas: Technology→IA, Finance→Bolsa, Business→Marketing, Global→Internacional.
                Reliability: 0-1 (se convierte automáticamente a escala 1-5).
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookInfo;
