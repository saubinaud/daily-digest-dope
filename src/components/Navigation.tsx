
import { ArrowLeft, Home, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryName } from '@/types/news';

interface NavigationProps {
  currentSection: 'welcome' | 'categories' | CategoryName;
  onNavigate: (section: 'welcome' | 'categories') => void;
  onToggleMenu?: () => void;
  categoryName?: CategoryName;
}

const Navigation = ({ currentSection, onNavigate, onToggleMenu, categoryName }: NavigationProps) => {
  const isInCategory = currentSection !== 'welcome' && currentSection !== 'categories';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentSection !== 'welcome' && (
            <Button
              onClick={() => onNavigate(isInCategory ? 'categories' : 'welcome')}
              variant="ghost"
              size="sm"
              className="btn-glass"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isInCategory ? 'Categorías' : 'Inicio'}
            </Button>
          )}
          
          {isInCategory && categoryName && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-news-accent animate-pulse" />
              <span className="font-semibold text-text-primary">{categoryName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {currentSection !== 'welcome' && (
            <Button
              onClick={() => onNavigate('welcome')}
              variant="ghost"
              size="sm"
              className="btn-glass"
            >
              <Home className="w-4 h-4" />
            </Button>
          )}
          
          {onToggleMenu && (
            <Button
              onClick={onToggleMenu}
              variant="ghost"
              size="sm"
              className="btn-glass md:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
