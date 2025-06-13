import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import appointmentRoutes from './routes/appointment.routes';
import cookieParser from 'cookie-parser';
import configRoutes from './routes/config.routes';

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true               
}));
app.use(cookieParser());

app.use(express.json());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/config', configRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
