// frontend/src/components/ErasmusGlobe.tsx
import { useEffect, useRef, useState, useMemo } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import destinosData from "@/data/destinos_erasmus.json";
import { GraduationCap, MapPin, Users, Globe as GlobeIcon, Search, X } from "lucide-react";

export interface Destino {
  id: string;
  codigoErasmus: string;
  universidad: string;
  centroDestino?: string;
  pais: string;
  ciudad: string;
  lat: number;
  lng: number;
  idioma: string;
  plazas: number | string;
  duracion: string;
  titulaciones: string[];
}

export const ErasmusGlobe = () => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedDestino, setSelectedDestino] = useState<Destino | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("ALL");

  // Ajustar dimensiones del contenedor dinámicamente
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 600,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Centrar cámara en Europa al inicio y configurar rotación automática suave
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 50.0, lng: 12.0, altitude: 2.1 }, 1000);
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
      }
    }
  }, []);

  // Filtrar destinos
  const filteredDestinos = useMemo(() => {
    return (destinosData as Destino[]).filter((d) => {
      const matchText =
        d.universidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ciudad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.pais.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.codigoErasmus.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDegree =
        degreeFilter === "ALL" ||
        d.titulaciones.some((t) => t.toLowerCase().includes(degreeFilter.toLowerCase()));

      return matchText && matchDegree;
    });
  }, [searchQuery, degreeFilter]);

  // Manejar clic en un punto del globo o de la lista
  const handleSelectDestino = (destino: Destino) => {
    setSelectedDestino(destino);
    if (globeRef.current) {
      // Parar rotación y enfocar el punto
      const controls = globeRef.current.controls();
      if (controls) controls.autoRotate = false;
      globeRef.current.pointOfView(
        { lat: destino.lat, lng: destino.lng, altitude: 1.2 },
        1200
      );
    }
  };

  return (
    <div className="relative w-full h-[750px] bg-[#090d16] rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col md:flex-row">
      {/* Panel Superior / Lateral de Filtros y Búsqueda */}
      <div className="w-full md:w-96 z-10 bg-card/60 backdrop-blur-md border-b md:border-b-0 md:border-r border-border p-4 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="mb-4">
            <span className="font-mono text-xs text-primary">// Destinos Internacionales</span>
            <h2 className="font-mono text-xl font-bold text-foreground flex items-center gap-2">
              <GlobeIcon className="h-5 w-5 text-primary" />
              ETSINF Erasmus 3D
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredDestinos.length} de {(destinosData as Destino[]).length} universidades disponibles
            </p>
          </div>

          {/* Input de búsqueda */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por universidad, ciudad o país..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-background/50 border border-border rounded-md text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Filtro por titulación */}
          <div className="mb-4">
            <select
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value)}
              className="w-full py-1.5 px-2 bg-background/50 border border-border rounded-md text-xs font-mono text-foreground focus:outline-none focus:border-primary"
            >
              <option value="ALL">Todas las titulaciones</option>
              <option value="Ingeniería Informática">Grado Ingeniería Informática</option>
              <option value="Ciencia de Datos">Grado Ciencia de Datos</option>
              <option value="Robótica">Informática Industrial y Robótica</option>
              <option value="Máster Universitario en Ingeniería Informática">Máster Informática (MUIinf)</option>
              <option value="Ciberseguridad">Máster Ciberseguridad (MUCC)</option>
            </select>
          </div>

          {/* Lista rápida scrolleable */}
          <div className="max-h-72 md:max-h-[380px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredDestinos.map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleSelectDestino(dest)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                  selectedDestino?.id === dest.id
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border/60 bg-card/20 hover:border-primary/40 hover:bg-card/40"
                }`}
              >
                <div className="font-mono font-semibold text-foreground line-clamp-1">
                  {dest.universidad}
                </div>
                <div className="text-muted-foreground text-[11px] flex items-center justify-between mt-1">
                  <span>{dest.ciudad}, {dest.pais}</span>
                  <span className="font-mono text-primary font-bold">{dest.codigoErasmus}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Crédito inferior */}
        <div className="pt-3 border-t border-border/50 text-[10px] font-mono text-muted-foreground">
          UPV • ETSINF Movilidad Europea
        </div>
      </div>

      {/* Contenedor del Globo 3D */}
      <div ref={containerRef} className="flex-1 h-full relative cursor-grab active:cursor-grabbing">
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={filteredDestinos}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "#22c55e"} // Verde acento brillante estilo terminal
          pointAltitude={0.06}
          pointRadius={0.4}
          pointsMerge={false}
          onPointClick={(point) => handleSelectDestino(point as Destino)}
          // Ondas brillantes concéntricas en cada punto
          ringsData={filteredDestinos}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => (t: number) => `rgba(34, 197, 94, ${1 - t})`}
          ringMaxRadius={2.5}
          ringPropagationSpeed={1.5}
          ringRepeatPeriod={1400}
        />

        {/* Modal / Ficha Flotante del destino seleccionado */}
        {selectedDestino && (
          <div className="absolute top-4 right-4 max-w-sm w-[90%] bg-card/95 border border-primary/50 shadow-2xl backdrop-blur-md rounded-xl p-4 z-20 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start gap-2">
              <span className="font-mono text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/30">
                {selectedDestino.codigoErasmus}
              </span>
              <button
                onClick={() => setSelectedDestino(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="font-mono font-bold text-sm text-foreground mt-2">
              {selectedDestino.universidad}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{selectedDestino.ciudad}, {selectedDestino.pais}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3 text-xs">
              <div className="p-2 rounded bg-background/60 border border-border">
                <span className="text-[10px] text-muted-foreground block">Plazas</span>
                <span className="font-mono font-bold text-foreground flex items-center gap-1">
                  <Users className="h-3 w-3 text-primary" /> {selectedDestino.plazas}
                </span>
              </div>
              <div className="p-2 rounded bg-background/60 border border-border">
                <span className="text-[10px] text-muted-foreground block">Idioma</span>
                <span className="font-mono font-bold text-foreground truncate block">
                  {selectedDestino.idioma || "Consultar"}
                </span>
              </div>
            </div>

            <div className="text-[11px] space-y-1.5 border-t border-border/60 pt-2">
              <span className="text-muted-foreground font-mono flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-primary" /> Titulaciones admitidas:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 max-h-24 overflow-y-auto text-foreground/90">
                {selectedDestino.titulaciones.map((tit, i) => (
                  <li key={i} className="line-clamp-1">{tit}</li>
                ))}
              </ul>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedDestino.lat},${selectedDestino.lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ver en Google Maps</span>
              &rarr;
            </a>
          </div>
        )}
      </div>
    </div>
  );
};