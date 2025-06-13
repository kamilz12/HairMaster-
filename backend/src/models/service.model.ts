// models/service.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string; // e.g. "Haircut"
  duration: number; // e.g. in minutes
  price: number;
}

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true, unique: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true }
});

export default mongoose.model<IService>('Service', ServiceSchema);
