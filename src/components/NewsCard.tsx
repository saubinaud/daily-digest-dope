
import { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Article } from '@/types/news';
import { useFavorites } from '@/hooks/useFavorites';

interface NewsCardProps {
  article: Article;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const [showContext, setShowContext] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleFavoriteToggle = () => {
    toggleFavorite(article.title);
  };

  const renderStars = (reliability: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < reliability
            ? 'fill-favorite-star text-favorite-star'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="news-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-news-accent bg-news-accent-light px-2 py-1 rounded-md">
          #{article.rank}
        </span>
        <button
          onClick={handleFavoriteToggle}
          className="p-1 rounded-md hover:bg-surface-tertiary transition-colors"
        >
          <Star
            className={`w-5 h-5 ${
              isFavorite(article.title)
                ? 'fill-favorite-star text-favorite-star'
                : 'text-gray-400 hover:text-favorite-star'
            }`}
          />
        </button>
      </div>
      
      <h3 className="text-lg font-semibold text-text-primary mb-3 leading-tight">
        {article.title}
      </h3>
      
      <p className="text-text-secondary mb-4 leading-relaxed">
        {article.summary}
      </p>
      
      <div className="border-t border-border pt-4">
        <button
          onClick={() => setShowContext(!showContext)}
          className="flex items-center space-x-2 text-news-accent hover:text-news-accent/80 transition-colors"
        >
          <span className="text-sm font-medium">Ver contexto</span>
          {showContext ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        {showContext && (
          <div className="mt-4 animate-fade-in">
            <div className="bg-surface-tertiary rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm font-medium text-text-primary">Fiabilidad:</span>
                <div className="flex space-x-1">
                  {renderStars(article.reliability)}
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {article.context}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
