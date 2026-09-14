import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email({ message: "Correo no válido" }).max(255),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }).max(72),
});

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        navigate("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Revisa tu correo para confirmar la cuenta.");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("No se pudo iniciar sesión con Google");
      return;
    }
    if (result.redirected) return;
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-border rounded-lg bg-card/70 backdrop-blur-sm p-8">
        <a href="/" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-3 w-3" /> volver
        </a>
        <div className="flex items-center gap-2 font-mono text-lg font-bold text-primary text-glow-green mb-6">
          <Terminal className="h-5 w-5" />
          <span>{mode === "login" ? "acceso_delegacion" : "nueva_cuenta"}</span>
          <span className="animate-blink">_</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-mono text-xs">Correo</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-mono text-xs">Contraseña</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="font-mono" />
          </div>
          <Button type="submit" disabled={busy} className="w-full font-mono">
            {mode === "login" ? "Entrar" : "Crear cuenta"}
          </Button>
        </form>

        <Button variant="outline" onClick={handleGoogle} className="w-full font-mono mt-3">
          Continuar con Google
        </Button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 w-full font-mono text-xs text-muted-foreground hover:text-primary"
        >
          {mode === "login" ? "> ¿No tienes cuenta? Regístrate" : "> Ya tengo cuenta"}
        </button>
      </div>
    </main>
  );
};

export default AuthPage;
