import { Schema, model, Document } from 'mongoose';

export interface IMiembroEquipo extends Document {
  nombre: string;
  cargo: string;
  fotoUrl?: string;
  curso?: string;
  createdAt: Date;
  updatedAt: Date;
}

const miembroEquipoSchema = new Schema<IMiembroEquipo>(
  {
    nombre: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true },
    fotoUrl: { type: String, default: '' },
    curso: { type: String, default: '' },
  },
  { timestamps: true }
);

// Mapeado explícito a tu colección 'equipo' de MongoDB Atlas
export const MiembroEquipo = model<IMiembroEquipo>('MiembroEquipo', miembroEquipoSchema, 'Equipo');