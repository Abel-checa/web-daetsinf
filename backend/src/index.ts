import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import dotenv from 'dotenv';

// 1. Localización exacta del archivo .env y diagnóstico
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
const backendDir = path.resolve(__dirname, '..');

console.log('--- DIAGNÓSTICO .ENV ---');
console.log('Ruta buscada:', envPath);
console.log('¿Existe el archivo en esa ruta?:', fs.existsSync(envPath));
try {
  console.log('Archivos en la carpeta backend/:', fs.readdirSync(backendDir));
} catch (e) {
  console.log('No se pudo leer la carpeta backend:', e);
}

// Cargar variables
const dotenvResult = dotenv.config({ path: envPath });
if (dotenvResult.error) {
  console.log('Error al cargar con dotenv:', dotenvResult.error);
}

console.log('ADMIN_USER cargado:', process.env.ADMIN_USER ? 'Sí' : 'NO (undefined)');
console.log('ADMIN_PASS cargado:', process.env.ADMIN_PASS ? 'Sí' : 'NO (undefined)');
console.log('MONGO_URI cargado:', process.env.MONGO_URI ? 'Sí' : 'NO (undefined)');
console.log('------------------------');

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI no está definido.');
} else {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'web_etsinf',
    });
    console.log('✅ Conectado exitosamente a MongoDB Atlas (web_etsinf)');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:', error);
  }
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  // Cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host || `localhost:${PORT}`;
  const parsedUrl = new URL(req.url || '/', `http://${host}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';

  console.log(`📡 [${req.method}] ${pathname}`);

  // Endpoint 1: Noticias (Público)
  if (pathname === '/api/noticias' && req.method === 'GET') {
    try {
      const noticias = await mongoose.connection.db
        ?.collection('Noticias')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(noticias ?? []));
      return;
    } catch (error) {
      console.error('Error al consultar Noticias:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error interno en noticias' }));
      return;
    }
  }

  // Endpoint 2: Equipo (Público)
  if (pathname === '/api/equipo' && req.method === 'GET') {
    try {
      const equipo = await mongoose.connection.db
        ?.collection('Equipo')
        .find({})
        .sort({ orden: 1, createdAt: 1 })
        .toArray();

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(equipo ?? []));
      return;
    } catch (error) {
      console.error('Error al consultar Equipo:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error interno en equipo' }));
      return;
    }
  }

  // Endpoint 3: GET /api/add_noticia -> Login y formulario web
  if (pathname === '/api/add_noticia' && req.method === 'GET') {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="Panel de Administracion DAETSINF"',
        'Content-Type': 'text/plain; charset=utf-8',
      });
      res.end('Acceso denegado: Se requiere autenticación.');
      return;
    }

    const base64Credentials = authHeader.split(' ')[1];
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [user, pass] = decoded.split(':');

    const envUser = process.env.ADMIN_USER?.trim();
    const envPass = process.env.ADMIN_PASS?.trim();

    if (!envUser || !envPass || user.trim() !== envUser || pass.trim() !== envPass) {
      res.writeHead(401, {
        'WWW-Authenticate': 'Basic realm="Panel de Administracion DAETSINF"',
        'Content-Type': 'text/plain; charset=utf-8',
      });
      res.end('Credenciales incorrectas.');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="es" class="dark">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Publicar Noticia | DAETSINF</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  background: '#09090b',
                  card: '#18181b',
                  border: '#27272a',
                  primary: '#10b981',
                  secondary: '#06b6d4',
                  foreground: '#f4f4f5',
                  muted: '#71717a'
                }
              }
            }
          }
        </script>
      </head>
      <body class="bg-background text-foreground font-mono min-h-screen flex items-center justify-center p-4">
        <div class="w-full max-w-lg bg-card/40 border border-border rounded-xl p-8 backdrop-blur-md shadow-2xl relative">
          <div class="mb-6">
            <span class="text-xs text-secondary tracking-widest uppercase">// Panel de Publicación</span>
            <h1 class="text-2xl font-bold mt-1 text-foreground">Nueva Noticia<span class="text-primary">.</span></h1>
            <p class="text-xs text-muted mt-1">Completa los campos para guardarla en la base de datos.</p>
          </div>

          <form id="newsForm" class="space-y-5">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Título de la Noticia</label>
              <input 
                type="text" 
                id="titulo" 
                required 
                placeholder="Ej. Convocatoria de Asamblea Extraordinaria"
                class="w-full bg-background/80 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Tipo / Categoría</label>
              <select 
                id="tipo"
                class="w-full bg-background/80 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
              >
                <option value="INFO">INFO</option>
                <option value="ACADÉMICO">ACADÉMICO</option>
                <option value="EVENTO">EVENTO</option>
                <option value="DELEGACIÓN">DELEGACIÓN</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Descripción / Contenido</label>
              <textarea 
                id="descripcion" 
                rows="4" 
                required 
                placeholder="Detalla el comunicado o la información de la noticia..."
                class="w-full bg-background/80 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              id="submitBtn"
              class="w-full py-3 px-4 rounded-lg bg-primary/10 border border-primary/40 text-primary font-bold text-sm hover:bg-primary hover:text-black transition-all duration-200"
            >
              Publicar Noticia →
            </button>
          </form>

          <div id="statusMessage" class="hidden mt-4 p-3 rounded-lg text-xs font-semibold text-center"></div>
        </div>

        <script>
          const form = document.getElementById('newsForm');
          const statusDiv = document.getElementById('statusMessage');
          const submitBtn = document.getElementById('submitBtn');

          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerText = 'Guardando...';

            const payload = {
              titulo: document.getElementById('titulo').value.trim(),
              tipo: document.getElementById('tipo').value,
              descripcion: document.getElementById('descripcion').value.trim(),
            };

            try {
              const res = await fetch('/api/add_noticia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });

              if (res.ok) {
                statusDiv.className = 'mt-4 p-3 rounded-lg text-xs font-semibold text-center border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 block';
                statusDiv.innerText = '✅ Noticia publicada exitosamente en MongoDB Atlas.';
                form.reset();
              } else {
                const err = await res.json();
                throw new Error(err.error || 'Error al guardar la noticia');
              }
            } catch (err) {
              statusDiv.className = 'mt-4 p-3 rounded-lg text-xs font-semibold text-center border border-rose-500/40 bg-rose-950/20 text-rose-400 block';
              statusDiv.innerText = '❌ Error: ' + err.message;
            } finally {
              submitBtn.disabled = false;
              submitBtn.innerText = 'Publicar Noticia →';
            }
          });
        </script>
      </body>
      </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // Endpoint 4: POST /api/add_noticia -> Inserción en MongoDB
  if (pathname === '/api/add_noticia' && req.method === 'POST') {
    try {
      let bodyData = '';
      req.on('data', (chunk) => (bodyData += chunk.toString()));
      req.on('end', async () => {
        try {
          const { titulo, descripcion, tipo } = JSON.parse(bodyData || '{}');

          if (!titulo || !descripcion) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Faltan campos requeridos (titulo, descripcion)' }));
            return;
          }

          const nuevaNoticia = {
            titulo,
            descripcion,
            tipo: tipo || 'INFO',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await mongoose.connection.db?.collection('Noticias').insertOne(nuevaNoticia);

          
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ mensaje: 'Noticia guardada con éxito' }));
        } catch (parseError) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'JSON mal formado' }));
        }
      });
      return;
    } catch (error) {
      console.error('Error al insertar noticia:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error interno del servidor' }));
      return;
    }
  }

  // 404 por defecto
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en: http://localhost:${PORT}`);
});