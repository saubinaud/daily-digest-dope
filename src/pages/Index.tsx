import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { NewsDigest, CategoryName } from '@/types/news';
import { newsApi } from '@/services/api';
import Navigation from '@/components/Navigation';
import Welcome from '@/components/Welcome';
import CategoryCarousel from '@/components/CategoryCarousel';
import CategoryView from '@/components/CategoryView';

// Fallback mock data in case API is not available
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

const Index = () => {
  const [currentSection, setCurrentSection] = useState<'welcome' | 'categories' | CategoryName>('welcome');
  const [activeCategory, setActiveCategory] = useState<CategoryName | null>(null);
  
  const welcomeRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoryViewRef = useRef<HTMLDivElement>(null);

  // Fetch digest from API
  const { data: digest, isLoading, error } = useQuery({
    queryKey: ['today-digest'],
    queryFn: async (): Promise<NewsDigest> => {
      try {
        console.log('🔄 Fetching digest from API...');
        const data = await newsApi.getTodayDigest();
        console.log('✅ Digest fetched successfully:', data);
        return data;
      } catch (apiError) {
        console.warn('⚠️ API not available, using fallback data:', apiError);
        // If API is not available, use fallback data
        return fallbackDigest;
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 1, // Only retry once before falling back
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Información",
        description: "Usando datos de demostración - API no disponible",
        variant: "default"
      });
    }
  }, [error]);

  const scrollToSection = (section: 'welcome' | 'categories' | CategoryName) => {
    setCurrentSection(section);
    
    switch (section) {
      case 'welcome':
        setActiveCategory(null);
        welcomeRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'categories':
        setActiveCategory(null);
        categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        setActiveCategory(section);
        categoryViewRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };

  const handleWelcomeNext = () => {
    scrollToSection('categories');
  };

  const handleOpenCategory = (category: CategoryName) => {
    scrollToSection(category);
  };

  const handleNavigate = (section: 'welcome' | 'categories') => {
    scrollToSection(section);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="glass-card p-8 rounded-3xl max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-news-accent to-news-accent/80 flex items-center justify-center animate-pulse-glow">
              <div className="w-8 h-8 rounded-full bg-white/30 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Cargando noticias
            </h2>
            <div className="w-full h-2 bg-surface-tertiary rounded-full overflow-hidden mb-4">
              <div className="w-full h-full bg-gradient-to-r from-news-accent to-news-accent/80 animate-shimmer" />
            </div>
            <p className="text-text-secondary">
              Conectando con API...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="glass-card p-8 rounded-3xl max-w-md">
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              No hay noticias disponibles
            </h1>
            <p className="text-text-secondary">
              No se encontraron noticias para hoy. Inténtalo más tarde.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-container">
      <Navigation 
        currentSection={currentSection}
        onNavigate={handleNavigate}
        categoryName={activeCategory}
      />
      
      <div ref={welcomeRef}>
        <Welcome onNext={handleWelcomeNext} />
      </div>
      
      <div ref={categoriesRef}>
        <CategoryCarousel 
          data={digest.categories}
          onOpenCategory={handleOpenCategory}
        />
      </div>
      
      {activeCategory && (
        <div ref={categoryViewRef}>
          <CategoryView
            categoryName={activeCategory}
            category={digest.categories[activeCategory]}
            onBack={() => scrollToSection('categories')}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
