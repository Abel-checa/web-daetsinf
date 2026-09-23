import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Noticia {
  _id: string;
  titulo: string;
  descripcion: string;
  tipo?: string;
  createdAt: string;
}

interface NewsCarouselProps {
  noticias: Noticia[];
}

export default function NewsCarousel({ noticias }: NewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Función para desplazar a la izquierda o derecha
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 360; // Desplazamiento aproximado al ancho de una tarjeta + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Controles del Carrusel (Flechas en la esquina superior) */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => scroll("left")}
          aria-label="Noticia anterior"
          className="p-2 rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Siguiente noticia"
          className="p-2 rounded-lg border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Contenedor desplazable horizontalmente */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{
          scrollbarWidth: "none", // Oculta barra en Firefox
          msOverflowStyle: "none", // Oculta barra en IE/Edge
        }}
      >
        {noticias.map((item) => (
          <article
            key={item._id}
            className="w-[300px] sm:w-[340px] shrink-0 snap-start rounded-lg border border-border bg-card/30 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-primary/40 transition-all duration-300 group"
          >
            <div>
              {/* Badge de tipo y fecha */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary uppercase">
                  {item.tipo || "INFO"}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>

              {/* Título */}
              <h3 className="font-mono font-bold text-foreground text-base group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {item.titulo}
              </h3>

              {/* Descripción */}
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {item.descripcion}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center text-xs font-mono text-secondary">
              <span>Leer más →</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}