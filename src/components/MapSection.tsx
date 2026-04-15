import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const points = [
  { name: "ETSINF – Edificio 1H", lat: 39.4817, lng: -0.3465, desc: "Escuela Técnica Superior de Ingeniería Informática" },
  { name: "Biblioteca Central", lat: 39.4795, lng: -0.3420, desc: "Biblioteca y sala de estudio principal" },
  { name: "Ágora", lat: 39.4790, lng: -0.3455, desc: "Zona de descanso, cafeterías y vida social" },
  { name: "Servicio de Deportes", lat: 39.4770, lng: -0.3400, desc: "Instalaciones deportivas del campus" },
  { name: "Rectorado", lat: 39.4805, lng: -0.3430, desc: "Edificio de Rectorado y servicios centrales" },
];

const MapSection = () => {
  return (
    <section id="mapa" className="py-24 bg-grid">
      <div className="container">
        <div className="mb-12">
          <p className="font-mono text-sm text-secondary mb-2">{'// Encuentra tu camino'}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Mapa del Campus<span className="text-primary">.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map */}
          <div className="lg:col-span-3 rounded-lg overflow-hidden border border-border border-glow-green h-[450px]">
            <MapContainer
              center={[39.4800, -0.3440]}
              zoom={16}
              className="h-full w-full"
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              {points.map((p, i) => (
                <Marker key={i} position={[p.lat, p.lng]}>
                  <Popup>
                    <strong>{p.name}</strong>
                    <br />
                    {p.desc}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Points list */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Puntos de interés para los alumnos del Grado en Ingeniería Informática en el campus de Vera de la UPV.
            </p>
            {points.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/30 hover:border-primary/40 transition-colors"
              >
                <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-mono text-sm font-semibold text-foreground">{p.name}</h4>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
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
