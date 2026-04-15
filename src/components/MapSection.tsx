import { MapPin } from "lucide-react";

const points = [
  {
    name: "ETSINF – Edificio 1H",
    desc: "Escuela Técnica Superior de Ingeniería Informática",
  },
  {
    name: "Biblioteca Central",
    desc: "Biblioteca y sala de estudio principal",
  },
  {
    name: "Ágora",
    desc: "Zona de descanso, cafeterías y vida social",
  },
  {
    name: "Servicio de Deportes",
    desc: "Instalaciones deportivas del campus",
  },
  {
    name: "Rectorado",
    desc: "Edificio de Rectorado y servicios centrales",
  },
];

const campusMapUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=-0.3535%2C39.4740%2C-0.3345%2C39.4865&layer=mapnik&marker=39.4800%2C-0.3440";

const fullMapUrl =
  "https://www.openstreetmap.org/?mlat=39.4800&mlon=-0.3440#map=16/39.4800/-0.3440";

const MapSection = () => {
  return (
    <section id="mapa" className="bg-grid py-24">
      <div className="container">
        <div className="mb-12">
          <p className="mb-2 font-mono text-sm text-secondary">{'// Encuentra tu camino'}</p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            Mapa del Campus<span className="text-primary">.</span>
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 overflow-hidden rounded-lg border border-border bg-card/30 h-[450px]">
            <iframe
              title="Mapa del campus de Vera de la UPV"
              src={campusMapUrl}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="lg:col-span-2 space-y-3">
            <p className="mb-4 text-sm text-muted-foreground">
              Puntos de interés para los alumnos del Grado en Ingeniería Informática en el campus de Vera de la UPV.
            </p>

            <a
              href={fullMapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              Abrir mapa completo
            </a>

            {points.map((point) => (
              <div
                key={point.name}
                className="flex items-start gap-3 rounded-lg border border-border bg-card/30 p-3 transition-colors hover:border-primary/40"
              >
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <h4 className="font-mono text-sm font-semibold text-foreground">{point.name}</h4>
                  <p className="text-xs text-muted-foreground">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
