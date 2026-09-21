import { getDatabase } from '../../src/lib/db.js';

interface TestItem {
  name: string;
  createdAt: Date;
}

async function test() {
  try {
    const db = await getDatabase();
    const collection = db.collection<TestItem>('test_items');

    // Insertar un documento
    const res = await collection.insertOne({
      name: 'Prueba de conexión exitosa',
      createdAt: new Date(),
    });
    console.log('Documento insertado con ID:', res.insertedId);

    // Leer los documentos
    const items = await collection.find().toArray();
    console.log('Documentos en la colección:', items);
  } catch (error) {
    console.error('Error durante la prueba:', error);
  }
}

test();