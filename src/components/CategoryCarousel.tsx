
import { CategoryName, NewsDigest } from '@/types/news';
import { Brain, TrendingUp, DollarSign, Globe } from 'lucide-react';

interface CategoryCarouselProps {
  data: NewsDigest['categories'];
  onOpenCategory: (category: CategoryName) => void;
}

const categoryIcons = {
  IA: Brain,
  Marketing: TrendingUp,
  Bolsa: DollarSign,
  Internacional: Globe,
};

const categoryColors = {
  IA: 'from-purple-500 to-purple-600',
  Marketing: 'from-green-500 to-green-600',
  Bolsa: 'from-yellow-500 to-yellow-600',
  Internacional: 'from-blue-500 to-blue-600',
};

const CategoryCarousel = ({ data, onOpenCategory }: CategoryCarouselProps) => {
  return (
    <div className="min-h-screen bg-surface-primary px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
            Daily News Digest
          </h2>
          <p className="text-text-secondary">
            Selecciona una categoría para ver las noticias del día
          </p>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 pb-4 snap-x snap-mandatory min-w-max">
            {(Object.keys(data) as CategoryName[]).map((categoryName, index) => {
              const category = data[categoryName];
              const Icon = categoryIcons[categoryName];
              const gradientClass = categoryColors[categoryName];
              
              return (
                <div
                  key={categoryName}
                  className="category-card min-w-[280px] md:min-w-[320px] snap-center animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => onOpenCategory(categoryName)}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradientClass} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {categoryName}
                  </h3>
                  
                  <p className="text-text-secondary mb-4">
                    {category.articles.length} {category.articles.length === 1 ? 'artículo' : 'artículos'}
                  </p>
                  
                  <p className="text-sm text-text-secondary line-clamp-3">
                    {category.insight.substring(0, 120)}...
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
