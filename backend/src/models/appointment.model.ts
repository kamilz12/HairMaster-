import mongoose, { Document, Schema } from 'mongoose';

// Interfejs TypeScript opisujący dane w rezerwacji
export interface IAppointment extends Document {
  userId: mongoose.Types.ObjectId | {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  };
  userName: string;
  userPhone: string; // ✅ Nowe pole
  serviceId: mongoose.Types.ObjectId | {
    _id: string;
    name: string;
    duration: number;
    price: number;
  };
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

// Schemat Mongoose
const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userPhone: {
      type: String,
      required: true,
      trim: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // Dodaje pola createdAt i updatedAt
  }
);

// Eksport modelu
export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
