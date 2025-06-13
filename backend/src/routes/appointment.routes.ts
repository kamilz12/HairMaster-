import express from 'express';
import { createAppointment, deleteAppointment, getFullyBookedDates, getOccupiedHours, getUserAppointments, updateAppointment } from '../controllers/appointment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();
router.get('/occupied', getOccupiedHours);
router.get('/fully-booked', getFullyBookedDates);
router.use(authenticate); // protects all routes below

router.post('/', createAppointment);
router.get('/', getUserAppointments);
router.delete('/:id', authenticate, deleteAppointment);
router.put('/:id', authenticate, updateAppointment);


export default router;