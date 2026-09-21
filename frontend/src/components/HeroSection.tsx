import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-grid scanline overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container relative z-10 text-center py-20">
        <p className="font-mono text-sm text-secondary mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {'// Delegación de Estudiantes'}
        </p>
        <h1 className="text-5xl md:text-7xl font-mono font-bold text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Ingeniería{" "}
          <span className="text-primary text-glow-green">Informática</span>
        </h1>
        <p className="font-mono text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          Universidad Politécnica de Valencia
        </p>
        <div className="font-mono text-sm text-terminal-dim mt-8 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <span className="text-secondary">$</span> Tu espacio para estar al día de todo lo que pasa en el grado
          <span className="animate-blink text-primary">▌</span>
        </div>

        <a
          href="#noticias"
          className="inline-flex items-center mt-16 text-muted-foreground hover:text-primary transition-colors animate-fade-in-up"
          style={{ animationDelay: "0.7s" }}
        >
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
