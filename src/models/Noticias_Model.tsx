import { Schema, model, Document } from 'mongoose';
import { Counter } from './Counter';

export interface INoticia extends Document {
  id_noticia: number;
  titulo: string;
  descripcion: string;
}

const noticiaSchema = new Schema<INoticia>({
  id_noticia: {
    type: Number,
    unique: true
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

noticiaSchema.pre('save', async function (next) {
  if (this.isNew) {
    const contador = await Counter.findOneAndUpdate(
      { _id: 'id_noticia' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id_noticia = contador.seq;
  }
  next();
});

export const Noticia = model<INoticia>('Noticia', noticiaSchema, 'noticias');