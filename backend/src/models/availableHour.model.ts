// models/availableHour.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailableHour extends Document {
  time: string; // e.g. "10:00"
};

const AvailableHourSchema = new Schema<IAvailableHour>({
  time: { type: String, required: true, unique: true }
});

export default mongoose.model<IAvailableHour>('AvailableHour', AvailableHourSchema);
