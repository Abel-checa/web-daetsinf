import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: No se encontró la variable MONGO_URI en el archivo .env');
  process.exit(1);
}

// Conexión a MongoDB con Mongoose
try {
  await mongoose.connect(MONGO_URI);
  console.log(' Conectado a MongoDB con éxito');
} catch (error) {
  console.error(' Error conectando a MongoDB:', error);
}

// Servidor nativo Node (sin express)
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/saludo' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ mensaje: 'Backend conectado a Mongo funcionando' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(PORT, () => {
  console.log(` Servidor backend escuchando en http://localhost:${PORT}`);
});