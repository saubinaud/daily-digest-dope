
import { CategoryName, NewsDigest } from '@/types/news';
import { Brain, TrendingUp, DollarSign, Globe, Star, Clock, TrendingUp as Trending } from 'lucide-react';

interface CategoryCarouselProps {
  data: NewsDigest['categories'];
  onOpenCategory: (category: CategoryName) => void;
}

const categoryConfig = {
  IA: {
    icon: Brain,
    gradient: 'category-ai',
    label: 'Inteligencia Artificial',
    description: 'Lo último en tecnología y automatización',
    accent: 'ai-primary'
  },
  Marketing: {
    icon: TrendingUp,
    gradient: 'category-marketing',
    label: 'Marketing Digital',
    description: 'Tendencias y estrategias de marketing',
    accent: 'marketing-primary'
  },
  Bolsa: {
    icon: DollarSign,
    gradient: 'category-bolsa',
    label: 'Mercados Financieros',
    description: 'Análisis bursátil y inversiones',
    accent: 'finance-primary'
  },
  Internacional: {
    icon: Globe,
    gradient: 'category-internacional',
    label: 'Noticias Internacionales',
    description: 'Acontecimientos mundiales relevantes',
    accent: 'international-primary'
  },
};

const CategoryCarousel = ({ data, onOpenCategory }: CategoryCarouselProps) => {
  return (
    <section className="min-h-screen py-24 px-6 relative overflow-hidden scroll-section">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full"
             style={{
               backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--text-primary)) 1px, transparent 0)',
               backgroundSize: '40px 40px'
             }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="heading-section mb-6">
            Daily News Digest
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Descubre las noticias más relevantes del día organizadas por categorías
          </p>
          
          {/* Stats bar */}
          <div className="glass-card inline-flex items-center px-6 py-3 rounded-2xl mt-8 space-x-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-favorite-star" />
              <span className="text-sm font-medium text-text-primary">
                {Object.values(data).reduce((acc, cat) => acc + cat.articles.length, 0)} artículos
              </span>
            </div>
            <div className="w-px h-6 bg-glass-border" />
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-news-accent" />
              <span className="text-sm font-medium text-text-primary">Actualizado hoy</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {(Object.keys(data) as CategoryName[]).map((categoryName, index) => {
            const category = data[categoryName];
            const config = categoryConfig[categoryName];
            const Icon = config.icon;
            const topArticle = category.articles[0];
            
            return (
              <div
                key={categoryName}
                className={`category-card ${config.gradient} group animate-scale-in`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => onOpenCategory(categoryName)}
              >
                {/* Category Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${config.accent} to-${config.accent}/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {category.articles.length > 2 && (
                    <div className="flex items-center space-x-1 glass-card px-3 py-1 rounded-full">
                      <Trending className="w-4 h-4 text-news-accent" />
                      <span className="text-xs font-medium text-text-primary">Trending</span>
                    </div>
                  )}
                </div>
                
                {/* Category Info */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-text-accent transition-colors">
                    {config.label}
                  </h3>
                  <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                    {config.description}
                  </p>
                  
                  {/* Article count with animation */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${config.accent}/20 to-${config.accent}/10 flex items-center justify-center`}>
                      <span className="text-lg font-bold text-text-primary">
                        {category.articles.length}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {category.articles.length === 1 ? 'Artículo' : 'Artículos'}
                      </p>
                      <p className="text-xs text-text-secondary">Disponibles</p>
                    </div>
                  </div>
                </div>
                
                {/* Featured Article Preview */}
                {topArticle && (
                  <div className="pt-6 border-t border-glass-border/30">
                    <div className="flex items-start space-x-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-news-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-news-accent">#{topArticle.rank}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-text-primary line-clamp-2 group-hover:text-text-accent transition-colors">
                          {topArticle.title}
                        </h4>
                      </div>
                    </div>
                    
                    {/* Reliability stars */}
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < topArticle.reliability
                              ? 'fill-favorite-star text-favorite-star'
                              : 'text-glass-border'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-text-secondary ml-2">
                        Fiabilidad {topArticle.reliability}/5
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Hover indicator */}
                <div className="mt-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="glass-card px-4 py-2 rounded-full">
                    <span className="text-xs font-medium text-news-accent">Explorar →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Bottom decoration */}
        <div className="mt-20 flex justify-center">
          <div className="glass-card px-8 py-4 rounded-2xl">
            <p className="text-sm text-text-secondary">
              <span className="text-news-accent font-semibold">Daily Digest</span> • Actualizado cada mañana
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
