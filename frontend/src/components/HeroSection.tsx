// frontend/src/components/HeroSection.tsx
import { Link } from "react-router-dom";
import { Globe, MapPin, Newspaper, Terminal, ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28 border-b border-border">
      {/* Patrón sutil de fondo / estética terminal */}
      <div className="absolute inset-0 bg-[radial-gradient(#22c55e15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          {/* Badge terminal status */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
            <Terminal className="h-3.5 w-3.5 animate-pulse" />
            <span>ETSINF • Delegació d'Alumnes UPV</span>
          </div>

          {/* Título principal */}
          <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            El portal para el alumnado de{" "}
            <span className="text-primary underline decoration-primary/40 underline-offset-8">
              Informática
            </span>
          </h1>

          {/* Descripción */}
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
            Toda la información académica, noticias de la delegación, ubicación de edificios en el campus y el mapa interactivo de destinos Erasmus internacionales.
          </p>

          {/* Botones de acción (CTAs) */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {/* Botón destacado al mapa Erasmus 3D */}
            <Link
              to="/erasmus"
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95"
            >
              <Globe className="h-4 w-4" />
              <span>Explorar Erasmus 3D</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Accesos rápidos a secciones de la página */}
            <a
              href="#mapa"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card/40 hover:bg-card hover:border-primary/50 text-foreground font-mono text-sm transition-all"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span>Ver Campus UPV</span>
            </a>

            <a
              href="#noticias"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card/40 hover:bg-card hover:border-primary/50 text-foreground font-mono text-sm transition-all"
            >
              <Newspaper className="h-4 w-4 text-primary" />
              <span>Noticias</span>
            </a>
          </div>

          {/* Prompt de terminal decorativo */}
          <div className="pt-6 font-mono text-xs text-muted-foreground">
            <span className="text-primary">$</span> upv-etsinf --ready --target=erasmus_2027_28
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;