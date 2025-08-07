
import { Lightbulb, Sparkles } from 'lucide-react';

interface InsightCardProps {
  text: string;
}

const InsightCard = ({ text }: InsightCardProps) => {
  return (
    <div className="insight-card group">
      <div className="flex items-start space-x-4">
        {/* Icon with animated glow */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-news-accent to-news-accent/80 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-news-accent/30 transition-all duration-300">
          <Lightbulb className="w-7 h-7 text-white" />
        </div>
        
        <div className="flex-1">
          {/* Header with sparkles */}
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-xl font-bold text-text-primary">
              Insight del día
            </h3>
            <Sparkles className="w-5 h-5 text-news-accent animate-pulse" />
          </div>
          
          {/* Insight text with better typography */}
          <p className="text-text-primary leading-relaxed text-lg">
            {text}
          </p>
          
          {/* Decorative bottom border */}
          <div className="mt-6 pt-4 border-t border-glass-border/30">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1 rounded-full bg-gradient-to-r from-news-accent to-news-accent/50" />
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                Análisis diario
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
