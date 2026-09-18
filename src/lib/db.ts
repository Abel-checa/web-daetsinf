import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Falta la variable MONGODB_URI en el archivo .env');
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDatabase(): Promise<Db> {
  if (!db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(); // Usa la base de datos indicada en la URI
    console.log('Conectado exitosamente a MongoDB Atlas');
  }
  return db;
}