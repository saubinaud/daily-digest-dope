
import { Button } from "@/components/ui/button";

interface WelcomeProps {
  onNext: () => void;
}

const Welcome = ({ onNext }: WelcomeProps) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-primary px-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-semibold text-text-primary mb-4">
          Good Morning
        </h1>
        <p className="text-lg text-text-secondary mb-2">
          Es un nuevo día, ¡vamos con todo!
        </p>
        <p className="text-base text-text-secondary mb-8 capitalize">
          {formattedDate}
        </p>
        <Button 
          onClick={onNext}
          className="btn-primary text-lg px-8 py-4"
        >
          Ver noticias
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
