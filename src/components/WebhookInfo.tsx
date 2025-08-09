
import { useState } from 'react';
import { Copy, ExternalLink, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const WebhookInfo = () => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Get the current app URL for the webhook
  const webhookUrl = `${window.location.origin}/api/news`;
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: "URL copiada al portapapeles",
    });
  };

  const examplePayload = {
    date: "2024-01-15",
    categories: {
      IA: {
        insight: "Tu análisis de IA aquí...",
        articles: [{
          rank: 1,
          title: "Título de la noticia",
          summary: "Resumen de la noticia...",
          context: "Contexto adicional...",
          reliability: 5
        }]
      },
      Marketing: {
        insight: "Tu análisis de Marketing aquí...",
        articles: [{ /* artículos */ }]
      },
      Bolsa: {
        insight: "Tu análisis de Bolsa aquí...",
        articles: [{ /* artículos */ }]
      },
      Internacional: {
        insight: "Tu análisis Internacional aquí...",
        articles: [{ /* artículos */ }]
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
        <div className="absolute bottom-16 right-0 w-96 glass-card rounded-2xl p-6 shadow-xl animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-news-accent/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-news-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Webhook n8n</h3>
              <p className="text-sm text-text-secondary">URL de conexión</p>
            </div>
          </div>
          
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
            
            <div className="text-xs text-text-secondary space-y-2">
              <p><strong>Método:</strong> POST</p>
              <p><strong>Content-Type:</strong> application/json</p>
            </div>
            
            <div className="flex items-center space-x-2 pt-2 border-t border-border">
              <button
                onClick={() => copyToClipboard(JSON.stringify(examplePayload, null, 2))}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookInfo;
