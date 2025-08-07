
import { CategoryName, Category } from '@/types/news';
import InsightCard from './InsightCard';
import NewsCard from './NewsCard';

interface CategoryViewProps {
  categoryName: CategoryName;
  category: Category;
  onBack: () => void;
}

const CategoryView = ({ categoryName, category, onBack }: CategoryViewProps) => {
  return (
    <section className="min-h-screen py-24 px-6 relative scroll-section">
      {/* Background gradient specific to category */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-news-accent-light/20 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Category Header */}
        <div className="mb-12 animate-fade-in">
          <div className="glass-card p-8 rounded-3xl text-center">
            <h1 className="heading-section mb-4">
              {categoryName}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-text-secondary">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-news-accent animate-pulse" />
                <span className="text-sm font-medium">
                  {category.articles.length} {category.articles.length === 1 ? 'artículo' : 'artículos'}
                </span>
              </div>
              <div className="w-px h-4 bg-glass-border" />
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-favorite-star" />
                <span className="text-sm font-medium">Actualizado hoy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insight Card */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <InsightCard text={category.insight} />
        </div>
        
        {/* Articles Grid */}
        <div className="masonry">
          {category.articles.map((article, index) => (
            <div
              key={`${article.title}-${index}`}
              className="masonry-item animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>

        {/* Bottom spacer */}
        <div className="h-24" />
      </div>
    </section>
  );
};

export default CategoryView;
