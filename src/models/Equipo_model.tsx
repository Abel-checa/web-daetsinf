import { Schema, model, Document } from 'mongoose';

export interface IEquipo extends Document {
  name: string;
  titulacion: string;
  cargo: string;
  fecha: Date;
}

const equipoSchema = new Schema<IEquipo>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  titulacion: {
    type: String,
    required: true,
    trim: true
  },
  cargo: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    required: true
  }
});

export const Equipo = model<IEquipo>('Equipo', equipoSchema, 'equipo');