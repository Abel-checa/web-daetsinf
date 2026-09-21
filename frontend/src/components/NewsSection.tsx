import { Calendar, ArrowRight } from "lucide-react";
/*
const newsItems = [
  {
    date: "2026-04-10",
    tag: "ACADÉMICO",
    title: "Nuevas optativas disponibles para el próximo curso",
    summary: "Se han publicado las nuevas asignaturas optativas para el curso 2026/27. Revisa las opciones y planifica tu matrícula.",
  },
  {
    date: "2026-04-05",
    tag: "EVENTO",
    title: "Hackathon UPV 2026 – ¡Inscripciones abiertas!",
    summary: "48 horas de código, pizza y premios. Forma tu equipo y participa en el mayor hackathon del campus.",
  },
  {
    date: "2026-03-28",
    tag: "DELEGACIÓN",
    title: "Resultados de las elecciones a delegado de curso",
    summary: "Ya están disponibles los resultados oficiales. Gracias a todos por participar en el proceso.",
  },
  {
    date: "2026-03-20",
    tag: "INFO",
    title: "Horarios de tutorías actualizados",
    summary: "Los profesores han actualizado sus horarios de tutorías para el segundo cuatrimestre.",
  },
];

const tagColors: Record<string, string> = {
  ACADÉMICO: "border-primary text-primary",
  EVENTO: "border-secondary text-secondary",
  DELEGACIÓN: "border-primary text-primary",
  INFO: "border-muted-foreground text-muted-foreground",
};

const NewsSection = () => {
  return (
    <section id="noticias" className="py-24 bg-grid">
      <div className="container">
        <div className="mb-12">
          <p className="font-mono text-sm text-secondary mb-2">{'// Últimas actualizaciones'}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Noticias<span className="text-primary">.</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {newsItems.map((item, i) => (
            <article
              key={i}
              className="group relative border border-border rounded-lg p-6 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:border-glow-green transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`font-mono text-[10px] px-2 py-0.5 border rounded ${tagColors[item.tag] || "border-border text-muted-foreground"}`}>
                  {item.tag}
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </span>
              </div>
              <h3 className="text-lg font-mono font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.summary}
              </p>
              <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
*/

import { useEffect, useState } from "react";

interface Noticia {
  _id: string;
  titulo: string;
  descripcion: string;
  tipo?: "ACADÉMICO" | "EVENTO" | "DELEGACIÓN" | "INFO" | string;
  createdAt?: string;
}

// Estilos de badge según la categoría
const BADGE_STYLES: Record<string, string> = {
  "ACADÉMICO": "text-emerald-400 border-emerald-500/40 bg-emerald-950/20",
  "DELEGACIÓN": "text-emerald-400 border-emerald-500/40 bg-emerald-950/20",
  "EVENTO": "text-cyan-400 border-cyan-500/40 bg-cyan-950/20",
  "INFO": "text-zinc-300 border-zinc-700 bg-zinc-900/40",
};

export default function NewsSection() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const res = await fetch("http://localhost:4000/api/noticias");
        if (!res.ok) throw new Error("Error en la respuesta");
        const data = await res.json();
        setNoticias(data ?? []);
      } catch (err) {
        console.error("Error al obtener noticias:", err);
      } finally {
        setCargando(false);
      }
    }

    fetchNoticias();
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-12 font-mono" id="noticias">
      {/* Cabecera terminal */}
      <div className="mb-8">
        <p className="text-cyan-400 text-sm font-semibold tracking-wide">
          // Últimas actualizaciones
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-1">
          Noticias<span className="text-emerald-400">.</span>
        </h1>
      </div>

      {/* Estado: Cargando */}
      {cargando && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-36 rounded-xl border border-zinc-800/80 bg-zinc-950/50 animate-pulse p-6"
            />
          ))}
        </div>
      )}

      {/* Condicional 1: NO hay noticias */}
      {!cargando && noticias.length === 0 && (
        <div className="w-full p-12 text-center rounded-xl border border-zinc-800/80 bg-zinc-950/40">
          {/* Icono Inbox en SVG nativo */}
          <svg
            className="w-10 h-10 mx-auto text-zinc-600 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
          <p className="text-zinc-300 font-medium text-lg">
            No hay noticias publicadas
          </p>
          <span className="text-xs text-zinc-500 mt-1 block">
            // Las nuevas actualizaciones del curso aparecerán aquí.
          </span>
        </div>
      )}

      {/* Condicional 2: SÍ hay noticias */}
      {!cargando && noticias.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {noticias.map((item) => {
            const badgeClass =
              BADGE_STYLES[item.tipo?.toUpperCase() || "INFO"] ||
              BADGE_STYLES["INFO"];

            const formattedDate = item.createdAt
              ? new Date(item.createdAt).toISOString().split("T")[0]
              : "2026-04-18";

            return (
              <article
                key={item._id}
                className="group relative rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-900/40"
              >
                {/* Meta: Tipo + Fecha con icono Calendar en SVG */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-[10px] tracking-wider px-2 py-0.5 rounded border font-semibold ${badgeClass}`}
                  >
                    {item.tipo ? item.tipo.toUpperCase() : "INFO"}
                  </span>

                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <svg
                      className="w-3.5 h-3.5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold text-zinc-100 leading-snug mb-2 group-hover:text-white transition-colors">
                  {item.titulo}
                </h3>

                {/* Descripción */}
                <p className="text-sm text-zinc-400 leading-relaxed font-sans">
                  {item.descripcion}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}