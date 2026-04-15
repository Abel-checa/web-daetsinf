import { Terminal } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
        <Terminal className="h-4 w-4 text-primary" />
        <span>DEINF_UPV © {new Date().getFullYear()}</span>
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        Delegación de Estudiantes · Ingeniería Informática · UPV
      </p>
    </div>
  </footer>
);

export default Footer;
