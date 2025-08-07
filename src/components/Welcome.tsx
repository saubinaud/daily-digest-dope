
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WelcomeProps {
  onNext: () => void;
}

const Welcome = ({ onNext }: WelcomeProps) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden scroll-section">
      {/* Background floating orbs */}
      <div className="floating-orb w-96 h-96 -top-48 -left-48 animate-float" style={{ animationDelay: '0s' }} />
      <div className="floating-orb w-64 h-64 -bottom-32 -right-32 animate-float" style={{ animationDelay: '2s' }} />
      <div className="floating-orb w-48 h-48 top-1/4 right-1/4 animate-float" style={{ animationDelay: '4s' }} />

      <div className="text-center animate-fade-in px-6 relative z-10">
        {/* Hero Text */}
        <h1 className="heading-hero mb-8 animate-glow">
          Good Morning
        </h1>
        
        {/* Subtitle with gradient */}
        <p className="text-xl md:text-2xl text-text-secondary mb-4 font-medium">
          Es un nuevo día, <span className="text-text-accent font-semibold">¡vamos con todo!</span>
        </p>
        
        {/* Date with glass effect */}
        <div className="glass-card inline-block px-6 py-3 mb-12 rounded-2xl">
          <p className="text-lg text-text-primary capitalize font-medium">
            {formattedDate}
          </p>
        </div>
        
        {/* CTA Button with enhanced styling */}
        <Button 
          onClick={onNext}
          className="btn-primary group text-xl px-10 py-6 animate-pulse-glow"
        >
          Ver noticias
          <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
        
        {/* Decorative elements */}
        <div className="mt-16 flex justify-center space-x-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-news-accent animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Welcome;
