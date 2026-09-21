import { Github, Linkedin, Mail } from "lucide-react";

const teamMembers = [
  { name: "Ana García", role: "Presidenta", bio: "4º curso · Apasionada por la IA y el open source" },
  { name: "Carlos Martínez", role: "Vicepresidente", bio: "3er curso · Backend developer y amante del café" },
  { name: "Laura Fernández", role: "Secretaria", bio: "3er curso · UX/UI enthusiast y organizadora de eventos" },
  { name: "Pablo López", role: "Tesorero", bio: "4º curso · Full-stack dev y gamer competitivo" },
  { name: "María Sánchez", role: "Vocal Académico", bio: "2º curso · Interesada en ciberseguridad" },
  { name: "David Ruiz", role: "Vocal de Actividades", bio: "3er curso · DevOps y hardware hacking" },
];

const TeamSection = () => {
  return (
    <section id="equipo" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />

      <div className="container relative z-10">
        <div className="mb-12">
          <p className="font-mono text-sm text-secondary mb-2">{'// Quiénes somos'}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Equipo<span className="text-primary">.</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="group border border-border rounded-lg p-6 bg-card/30 backdrop-blur-sm hover:border-primary/40 transition-all duration-300"
            >
              {/* Avatar placeholder */}
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 border border-border group-hover:border-primary/50 transition-colors">
                <span className="font-mono text-xl text-primary font-bold">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>

              <h3 className="font-mono font-semibold text-foreground text-lg">{member.name}</h3>
              <p className="font-mono text-xs text-primary mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>

              <div className="flex gap-3">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-4 w-4" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
