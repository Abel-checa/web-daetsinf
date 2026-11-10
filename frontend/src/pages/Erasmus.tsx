// frontend/src/pages/Erasmus.tsx
import { ErasmusGlobe } from "@/components/ErasmusGlobe";

export const Erasmus = () => {
  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <p className="font-mono text-sm text-primary">// Movilidad Internacional ETSINF</p>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Mapa de Destinos <span className="text-primary">ERASMUS+</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl mt-2">
            Explora de manera interactiva los convenios europeos de la Escuela Técnica Superior de Ingeniería Informática (UPV). Haz clic sobre cualquier destino para consultar plazas, grados y requisitos.
          </p>
        </div>

        {/* Sección del Globo Terráqueo 3D */}
        <ErasmusGlobe />
      </div>
    </div>
  );
};