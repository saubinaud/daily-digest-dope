
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { NewsDigest, CategoryName } from '@/types/news';
import Navigation from '@/components/Navigation';
import Welcome from '@/components/Welcome';
import CategoryCarousel from '@/components/CategoryCarousel';
import CategoryView from '@/components/CategoryView';

// Mock data para demostración
const mockDigest: NewsDigest = {
  date: new Date().toISOString().split('T')[0],
  categories: {
    IA: {
      insight: "La inteligencia artificial continúa transformando industrias con avances significativos en procesamiento de lenguaje natural y automatización. Los desarrollos recientes muestran un enfoque hacia la IA más eficiente y sostenible, con nuevos modelos que prometen revolucionar la forma en que interactuamos con la tecnología.",
      articles: [
        {
          rank: 1,
          title: "OpenAI lanza GPT-5 con capacidades multimodales mejoradas",
          summary: "La nueva versión del modelo de lenguaje incluye mejor comprensión de imágenes, video y audio, marcando un hito en la evolución de la IA conversacional. Este avance promete revolucionar múltiples sectores industriales.",
          context: "Este lanzamiento representa un avance significativo en la capacidad de procesamiento multimodal de la IA. GPT-5 puede ahora procesar simultáneamente texto, imágenes y audio con mayor precisión, abriendo nuevas posibilidades para aplicaciones empresariales y creativas.",
          reliability: 5
        },
        {
          rank: 2,
          title: "Microsoft integra IA generativa en todas sus aplicaciones de Office",
          summary: "La suite de productividad de Microsoft incorpora asistentes de IA en Word, Excel y PowerPoint, prometiendo revolucionar la forma en que trabajamos con documentos y presentaciones.",
          context: "Esta integración masiva de IA en herramientas de productividad podría cambiar fundamentalmente los flujos de trabajo empresariales y personales, automatizando tareas repetitivas y mejorando la creatividad.",
          reliability: 4
        },
        {
          rank: 3,
          title: "Nuevos chips de IA de Google superan a la competencia en eficiencia",
          summary: "Los procesadores TPU de quinta generación de Google demuestran un rendimiento excepcional en tareas de machine learning, estableciendo un nuevo estándar en la industria.",
          context: "Estos chips representan un salto cuántico en la eficiencia energética para aplicaciones de IA, lo que podría democratizar el acceso a tecnologías avanzadas de inteligencia artificial.",
          reliability: 4
        }
      ]
    },
    Marketing: {
      insight: "El marketing digital evoluciona hacia estrategias más personalizadas y basadas en datos, con un enfoque creciente en la privacidad del usuario y la autenticidad de marca. Las plataformas sociales continúan innovando en comercio social y experiencias inmersivas.",
      articles: [
        {
          rank: 1,
          title: "TikTok introduce nuevas herramientas de comercio social",
          summary: "La plataforma lanza funciones avanzadas para creadores y marcas, facilitando la venta directa a través de videos cortos y streams en vivo, transformando el panorama del e-commerce.",
          context: "Estas herramientas representan la evolución del social commerce, donde las redes sociales se convierten en plataformas de venta directa, eliminando fricciones en el proceso de compra.",
          reliability: 4
        },
        {
          rank: 2,
          title: "El marketing con influencers alcanza los $21 mil millones en 2024",
          summary: "La industria del marketing de influencers continúa su crecimiento exponencial, con marcas invirtiendo más que nunca en colaboraciones auténticas y contenido generado por usuarios.",
          context: "Este crecimiento refleja el cambio en las preferencias de los consumidores hacia contenido más auténtico y personalizado, alejándose de la publicidad tradicional.",
          reliability: 5
        }
      ]
    },
    Bolsa: {
      insight: "Los mercados muestran volatilidad moderada con tendencias alcistas en el sector tecnológico, mientras que los inversionistas se mantienen cautelosos ante las próximas decisiones de política monetaria. Las criptomonedas experimentan una fase de consolidación tras los recientes movimientos regulatorios.",
      articles: [
        {
          rank: 1,
          title: "Las acciones de NVIDIA alcanzan máximos históricos",
          summary: "El fabricante de chips registra ganancias del 15% en la sesión tras reportar ingresos superiores a las expectativas, impulsado por la creciente demanda de hardware para IA.",
          context: "El crecimiento de NVIDIA refleja la creciente demanda de hardware especializado para aplicaciones de inteligencia artificial y computación de alto rendimiento, posicionando a la empresa como líder del mercado.",
          reliability: 5
        },
        {
          rank: 2,
          title: "Bitcoin se estabiliza por encima de los $65,000",
          summary: "La criptomoneda principal muestra signos de consolidación después de semanas de volatilidad, con analistas señalando un posible rompimiento alcista en las próximas semanas.",
          context: "Esta estabilización ocurre en un contexto de mayor claridad regulatoria y adopción institucional, sugiriendo una maduración del mercado de criptomonedas.",
          reliability: 3
        }
      ]
    },
    Internacional: {
      insight: "La geopolítica global se mantiene en un estado de transformación, con nuevos acuerdos comerciales y tensiones emergentes que reshapean el panorama internacional. Los esfuerzos de cooperación en cambio climático muestran avances prometedores.",
      articles: [
        {
          rank: 1,
          title: "Cumbre climática COP29 alcanza acuerdos históricos",
          summary: "Los líderes mundiales firman compromisos vinculantes para reducir emisiones de carbono en un 50% antes de 2030, marcando un punto de inflexión en la acción climática global.",
          context: "Este acuerdo representa el consenso más amplio alcanzado en décadas sobre acción climática, con mecanismos de cumplimiento más estrictos y financiamiento específico para países en desarrollo.",
          reliability: 5
        },
        {
          rank: 2,
          title: "Nuevo acuerdo comercial entre UE y Mercosur genera expectativas",
          summary: "Después de décadas de negociaciones, ambos bloques económicos finalizan un tratado de libre comercio que beneficiará a más de 700 millones de personas.",
          context: "Este acuerdo histórico elimina aranceles en sectores clave y establece estándares comunes de sostenibilidad, promoviendo el comercio justo y responsable.",
          reliability: 4
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
              Preparando tu digest diario...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !digest) {
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
