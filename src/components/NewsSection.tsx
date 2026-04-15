import { Calendar, ArrowRight } from "lucide-react";

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
