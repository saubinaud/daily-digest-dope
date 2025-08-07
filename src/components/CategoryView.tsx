
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen bg-surface-primary px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8 animate-fade-in">
          <Button
            onClick={onBack}
            variant="ghost"
            className="p-2 hover:bg-surface-tertiary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-semibold text-text-primary">
            {categoryName}
          </h1>
        </div>

        <InsightCard text={category.insight} />
        
        <div className="space-y-6">
          {category.articles.map((article, index) => (
            <div
              key={`${article.title}-${index}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryView;
