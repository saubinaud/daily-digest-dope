
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { NewsDigest, CategoryName, AppStep } from '@/types/news';
import Welcome from '@/components/Welcome';
import CategoryCarousel from '@/components/CategoryCarousel';
import CategoryView from '@/components/CategoryView';

// Mock data para demostración
const mockDigest: NewsDigest = {
  date: new Date().toISOString().split('T')[0],
  categories: {
    IA: {
      insight: "La inteligencia artificial continúa transformando industrias con avances significativos en procesamiento de lenguaje natural y automatización. Los desarrollos recientes muestran un enfoque hacia la IA más eficiente y sostenible.",
      articles: [
        {
          rank: 1,
          title: "OpenAI lanza GPT-5 con capacidades multimodales mejoradas",
          summary: "La nueva versión del modelo de lenguaje incluye mejor comprensión de imágenes, video y audio, marcando un hito en la evolución de la IA conversacional.",
          context: "Este lanzamiento representa un avance significativo en la capacidad de procesamiento multimodal de la IA. GPT-5 puede ahora procesar simultáneamente texto, imágenes y audio con mayor precisión.",
          reliability: 5
        },
        {
          rank: 2,
          title: "Microsoft integra IA generativa en todas sus aplicaciones de Office",
          summary: "La suite de productividad de Microsoft incorpora asistentes de IA en Word, Excel y PowerPoint, prometiendo revolucionar la forma en que trabajamos.",
          context: "Esta integración masiva de IA en herramientas de productividad podría cambiar fundamentalmente los flujos de trabajo empresariales y personales.",
          reliability: 4
        }
      ]
    },
    Marketing: {
      insight: "El marketing digital evoluciona hacia estrategias más personalizadas y basadas en datos, con un enfoque creciente en la privacidad del usuario y la autenticidad de marca.",
      articles: [
        {
          rank: 1,
          title: "TikTok introduce nuevas herramientas de comercio social",
          summary: "La plataforma lanza funciones avanzadas para creadores y marcas, facilitando la venta directa a través de videos cortos y streams en vivo.",
          context: "Estas herramientas representan la evolución del social commerce, donde las redes sociales se convierten en plataformas de venta directa.",
          reliability: 4
        }
      ]
    },
    Bolsa: {
      insight: "Los mercados muestran volatilidad moderada con tendencias alcistas en el sector tecnológico, mientras que los inversionistas se mantienen cautelosos ante las próximas decisiones de política monetaria.",
      articles: [
        {
          rank: 1,
          title: "Las acciones de NVIDIA alcanzan máximos históricos",
          summary: "El fabricante de chips registra ganancias del 15% en la sesión tras reportar ingresos superiores a las expectativas, impulsado por la demanda de IA.",
          context: "El crecimiento de NVIDIA refleja la creciente demanda de hardware especializado para aplicaciones de inteligencia artificial y computación de alto rendimiento.",
          reliability: 5
        }
      ]
    },
    Internacional: {
      insight: "La geopolítica global se mantiene en un estado de transformación, con nuevos acuerdos comerciales y tensiones emergentes que reshapean el panorama internacional.",
      articles: [
        {
          rank: 1,
          title: "Cumbre climática COP29 alcanza acuerdos históricos",
          summary: "Los líderes mundiales firman compromisos vinculantes para reducir emisiones de carbono en un 50% antes de 2030, marcando un punto de inflexión en la acción climática.",
          context: "Este acuerdo representa el consenso más amplio alcanzado en décadas sobre acción climática, con mecanismos de cumplimiento más estrictos.",
          reliability: 5
        }
      ]
    }
  }
};

const Index = () => {
  const [step, setStep] = useState<AppStep>('welcome');
  const [activeCategory, setActiveCategory] = useState<CategoryName | null>(null);

  // En una implementación real, esto haría fetch a la API
  const { data: digest, isLoading, error } = useQuery({
    queryKey: ['today-digest'],
    queryFn: async (): Promise<NewsDigest> => {
      // Simular carga de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockDigest;
    },
    staleTime: 1000 * 60 * 30, // 30 minutos
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las noticias del día",
        variant: "destructive"
      });
    }
  }, [error]);

  const handleWelcomeNext = () => {
    setStep('carousel');
  };

  const handleOpenCategory = (category: CategoryName) => {
    setActiveCategory(category);
    setStep('category');
  };

  const handleBack = () => {
    setStep('carousel');
    setActiveCategory(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="animate-pulse">
          <div className="text-2xl font-semibold text-text-primary mb-4">
            Cargando noticias...
          </div>
          <div className="w-48 h-2 bg-surface-tertiary rounded-full overflow-hidden">
            <div className="w-full h-full bg-news-accent animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !digest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text-primary mb-4">
            No hay noticias disponibles
          </h1>
          <p className="text-text-secondary">
            No se encontraron noticias para hoy. Inténtalo más tarde.
          </p>
        </div>
      </div>
    );
  }

  switch (step) {
    case 'welcome':
      return <Welcome onNext={handleWelcomeNext} />;
    
    case 'carousel':
      return (
        <CategoryCarousel 
          data={digest.categories}
          onOpenCategory={handleOpenCategory}
        />
      );
    
    case 'category':
      if (!activeCategory) return null;
      return (
        <CategoryView
          categoryName={activeCategory}
          category={digest.categories[activeCategory]}
          onBack={handleBack}
        />
      );
    
    default:
      return null;
  }
};

export default Index;
