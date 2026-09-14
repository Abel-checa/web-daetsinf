import { useEffect, useState } from "react";
import { Calendar, Plus, Trash2, ChevronLeft, ChevronRight, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type NewsItem = {
  id: string;
  user_id: string;
  title: string;
  summary: string;
  tag: string;
  published_at: string;
};

const TAGS = ["ACADÉMICO", "EVENTO", "DELEGACIÓN", "INFO"];
const PAGE_SIZE = 4;

const tagColors: Record<string, string> = {
  "ACADÉMICO": "border-primary text-primary",
  EVENTO: "border-secondary text-secondary",
  "DELEGACIÓN": "border-primary text-primary",
  INFO: "border-muted-foreground text-muted-foreground",
};

const newsSchema = z.object({
  title: z.string().trim().min(3, { message: "El título es muy corto" }).max(120),
  summary: z.string().trim().min(5, { message: "El texto es muy corto" }).max(600),
  tag: z.string().max(20),
});

const NewsSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: "", summary: "", tag: "INFO" });

  const load = async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("published_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("No se pudieron cargar las noticias");
      return;
    }
    setItems((data as NewsItem[]) ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages - 1) setPage(totalPages - 1);
  }, [totalPages, page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = newsSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("news").insert({ ...parsed.data, user_id: user.id });
    setBusy(false);
    if (error) {
      toast.error("No se pudo publicar la noticia");
      return;
    }
    toast.success("Noticia publicada");
    setForm({ title: "", summary: "", tag: "INFO" });
    setOpen(false);
    setPage(0);
    load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) {
      toast.error("No se pudo borrar");
      return;
    }
    toast.success("Noticia borrada");
    load();
  };

  return (
    <section id="noticias" className="py-24 bg-grid">
      <div className="container">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-secondary mb-2">{'// Últimas actualizaciones'}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Noticias<span className="text-primary">.</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="font-mono">
                      <Plus className="h-4 w-4 mr-1" /> Nueva noticia
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-mono">Publicar noticia</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="font-mono text-xs">Título</Label>
                        <Input id="title" value={form.title} maxLength={120}
                          onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="summary" className="font-mono text-xs">Texto</Label>
                        <Textarea id="summary" rows={4} maxLength={600} value={form.summary}
                          onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-mono text-xs">Categoría</Label>
                        <Select value={form.tag} onValueChange={(v) => setForm({ ...form, tag: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {TAGS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" disabled={busy} className="w-full font-mono">Publicar</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" title="Cerrar sesión"
                  onClick={async () => { await supabase.auth.signOut(); toast.success("Sesión cerrada"); }}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button variant="outline" className="font-mono" onClick={() => navigate("/auth")}>
                <LogIn className="h-4 w-4 mr-1" /> Acceso delegación
              </Button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground border border-dashed border-border rounded-lg p-8 text-center">
            {"// Todavía no hay noticias publicadas"}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {current.map((item) => (
              <article
                key={item.id}
                className="group relative border border-border rounded-lg p-5 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`font-mono text-[10px] px-2 py-0.5 border rounded ${tagColors[item.tag] || "border-border text-muted-foreground"}`}>
                    {item.tag}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {item.published_at}
                  </span>
                  {user?.id === item.user_id && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="ml-auto text-muted-foreground hover:text-destructive"
                      title="Borrar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <h3 className="text-base font-mono font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </article>
            ))}
          </div>
        )}

        {items.length > PAGE_SIZE && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-mono text-xs text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
            <Button variant="outline" size="icon" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
