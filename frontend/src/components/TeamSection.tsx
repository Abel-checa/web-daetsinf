import { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";

interface Miembro {
  _id: string;
  nombre: string;
  cargo: string;
  fotoUrl?: string;
  curso?: string;
}

// Jerarquía para ordenar automáticamente por rango
const JERARQUIA: Record<string, number> = {
  Delegado: 1,
  ViceDelegado: 2,
  Secretario: 3,
  Tesorero: 4,
  Coordinador: 5,
  Vocal: 6,
};

function getOrdenCargo(cargo: string): number {
  const c = cargo.toLowerCase();
  for (const [key, peso] of Object.entries(JERARQUIA)) {
    if (c.includes(key)) return peso;
  }
  return 99;
}

const TeamSection = () => {
  const [equipo, setEquipo] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchEquipo() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const res = await fetch(`${API_URL}/api/equipo`);

        if (!res.ok) throw new Error("Error al consultar el equipo");

        const data: Miembro[] = await res.json();
        const ordenados = [...data].sort(
          (a, b) => getOrdenCargo(a.cargo) - getOrdenCargo(b.cargo)
        );

        setEquipo(ordenados);
      } catch (error) {
        console.error("Error al cargar equipo:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEquipo();
  }, []);

  return (
    <section id="equipo" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />

      <div className="container relative z-10">
        <div className="mb-12">
          <p className="font-mono text-sm text-secondary mb-2">{"// Quiénes somos"}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Equipo<span className="text-primary">.</span>
          </h2>
        </div>

        {/* 1. Estado de carga */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-lg border border-border bg-card/30 animate-pulse p-6"
              />
            ))}
          </div>
        )}

        {/* 2. Estado vacío: no hay equipo */}
        {!loading && equipo.length === 0 && (
          <div className="w-full py-16 px-6 text-center border border-border rounded-lg bg-card/30 backdrop-blur-sm">
            <p className="font-mono text-lg text-foreground font-semibold">
              No hay equipo disponible
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              {"// Actualmente no constan miembros registrados en la delegación."}
            </p>
          </div>
        )}

        {/* 3. Renderizado del equipo sin enlaces */}
        {!loading && equipo.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {equipo.map((member) => (
              <div
                key={member._id}
                className="group border border-border rounded-lg p-6 bg-card/30 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Foto o Iniciales */}
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 border border-border group-hover:border-primary/50 transition-colors overflow-hidden shrink-0">
                    {member.fotoUrl ? (
                      <img
                        src={member.fotoUrl}
                        alt={member.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="font-mono text-xl text-primary font-bold">
                        {member.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    )}
                  </div>

                  <h3 className="font-mono font-semibold text-foreground text-lg">
                    {member.nombre}
                  </h3>
                  <p className="font-mono text-xs text-primary mb-1">
                    {member.cargo}
                  </p>
                  {member.curso && (
                    <p className="text-xs text-muted-foreground">
                      {member.curso}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;