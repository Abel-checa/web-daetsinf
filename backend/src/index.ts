import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI no está definido en backend/.env');
  process.exit(1);
}

try {
  await mongoose.connect(MONGO_URI, {
    dbName: 'web_etsinf',
  });
  console.log('Conectado exitosamente a MongoDB Atlas');
} catch (error) {
  console.error('Error conectando a MongoDB Atlas:', error);
  process.exit(1);
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host || `localhost:${PORT}`;
  const parsedUrl = new URL(req.url || '/', `http://${host}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';

  if (pathname === '/api/noticias' && req.method === 'GET') {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('No hay instancia de base de datos activa');
      }

      // Listar las colecciones reales dentro de web_etsinf
      const collections = await db.listCollections().toArray();
      const colNames = collections.map((c) => c.name);
      console.log('Colecciones reales en web_etsinf:', colNames);

      // Buscar directamente con el cliente nativo
      const docsMayus = await db.collection('Noticias').find({}).toArray();
      const docsMinus = await db.collection('noticias').find({}).toArray();

      console.log(`Documentos en "Noticias": ${docsMayus.length}`);
      console.log(`Documentos en "noticias": ${docsMinus.length}`);

      const dataFinal = docsMayus.length > 0 ? docsMayus : docsMinus;

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dataFinal));
    } catch (error) {
      console.error('Error en consulta directa:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error al consultar noticias' }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});