import Appointment from '../models/appointment.model';
import User from '../models/user.model';
import { Request, Response } from 'express';

// GET /api/appointments/:id
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
                                        .populate('userId', 'firstName lastName phoneNumber') // Populate user details
                                        .populate('serviceId', 'name duration price'); // Populate service details
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/appointments (for a list of appointments, e.g., on dashboard)
export const getUserAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.find({ userId: req.user?.userId })
                                            .populate('userId', 'firstName lastName phoneNumber')
                                            .populate('serviceId', 'name duration price')
                                            .sort({ date: 1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};