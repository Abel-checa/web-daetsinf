/*import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  description: string;
  type: string;
}

const ROTATE_INTERVAL_MS = 5000;

export default function NewsPanel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Cargar noticias desde Supabase al montar el componente
  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error cargando noticias:", error.message);
      } else {
        setNews(data ?? []);
      }
      setLoading(false);
    }

    fetchNews();
  }, []);

  // 2. Rotar automáticamente cada 5 segundos si hay más de una noticia
  useEffect(() => {
    if (news.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [news]);

  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto p-6 text-center text-gray-400">
        Cargando noticias...
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto p-6 text-center text-gray-500 border rounded-lg">
        No hay noticias
      </div>
    );
  }

  const current = news[currentIndex];

  return (
    <div className="w-full max-w-xl mx-auto p-6 border rounded-lg shadow-sm transition-opacity duration-500">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {current.type}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(current.date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <h3 className="text-lg font-bold mb-2">{current.title}</h3>
      <p className="text-sm text-gray-600">{current.description}</p>

      {/* Indicadores de posición (puntitos) }
      {news.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {news.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
*//////////////////////////////////////////////////////

import { useEffect, useState } from "react";

interface NewsItem {
  _id: string;
  titulo: string;
  descripcion: string;
  createdAt?: string;
  type?: string;
}

const ROTATE_INTERVAL_MS = 5000;

export default function NewsPanel() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Cargar noticias desde tu Backend de Node/MongoDB
  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("http://localhost:4000/api/noticias");
        if (!response.ok) {
          throw new Error("Respuesta incorrecta del servidor");
        }
        const data = await response.json();
        setNews(data ?? []);
      } catch (error) {
        console.error("Error cargando noticias:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  // 2. Rotar automáticamente cada 5 segundos si hay más de una noticia
  useEffect(() => {
    if (news.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [news]);

  // Pantalla de carga
  if (loading) {
    return (
      <div className="w-full max-w-xl mx-auto p-6 text-center text-gray-400">
        Cargando noticias...
      </div>
    );
  }

  // 1. En caso de que NO haya noticias: cartel informativo
  if (news.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto p-6 text-center text-gray-500 border rounded-lg bg-gray-50/50">
        No hay noticias
      </div>
    );
  }

  // 2. Si SÍ hay noticias: coger la información y presentarla
  const current = news[currentIndex];

  return (
    <div className="w-full max-w-xl mx-auto p-6 border rounded-lg shadow-sm transition-opacity duration-500">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {current.type || "Aviso"}
        </span>
        <span className="text-xs text-gray-400">
          {current.createdAt
            ? new Date(current.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""}
        </span>
      </div>

      <h3 className="text-lg font-bold mb-2">{current.titulo}</h3>
      <p className="text-sm text-gray-600">{current.descripcion}</p>

      {/* Indicadores de posición (puntitos) */}
      {news.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {news.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}