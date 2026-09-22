import { Schema, model, Document } from 'mongoose';

export interface INoticia extends Document {
  titulo: string;
  descripcion: string;
  tipo?: 'ACADÉMICO' | 'EVENTO' | 'DELEGACIÓN' | 'INFO';
  createdAt: Date;
  updatedAt: Date;
}

const noticiaSchema = new Schema<INoticia>(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    tipo: {
      type: String,
      enum: ['ACADÉMICO', 'EVENTO', 'DELEGACIÓN', 'INFO'],
      default: 'INFO',
    },
  },
  { timestamps: true }
);

// El tercer argumento DEBE ser 'Noticias' con la N mayúscula:
export const Noticia = model<INoticia>('Noticia', noticiaSchema, 'Noticias');