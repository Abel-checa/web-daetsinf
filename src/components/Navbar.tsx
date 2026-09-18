import { useState } from "react";
import { Menu, X, Terminal } from "lucide-react";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Noticias", href: "#noticias" },
  { label: "Equipo", href: "#equipo" },
  { label: "Mapa", href: "#mapa" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <a href="#inicio" className="flex items-center gap-2 font-mono text-lg font-bold text-primary text-glow-green">
          <Terminal className="h-5 w-5" />
          <span>DEETSINF_UPV</span>
          <span className="animate-blink text-primary">_</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {`> ${item.label}`}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 font-mono text-sm text-muted-foreground hover:text-primary hover:bg-muted/50"
            >
              {`> ${item.label}`}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
