import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Nova Coleção"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl animate-fade-in">
          <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Nova Coleção 2024
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-light text-foreground mb-6 leading-tight">
            Elegância que{" "}
            <span className="italic text-gradient">encanta</span>
          </h1>
          <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
            Descubra peças exclusivas que combinam sofisticação e conforto. 
            Vista-se com estilo e autenticidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg">
              Ver Coleção
            </Button>
            <Button variant="heroOutline" size="lg">
              Novidades
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
