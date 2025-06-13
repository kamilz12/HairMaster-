import { Request, Response } from 'express';
import Appointment from '../models/appointment.model';
import AvailableHour from '../models/availableHour.model';

// POST /api/appointments
// POST /api/appointments
export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceId, date, notes, userName} = req.body; // Added 'notes'
    const userId = req.user?.userId; // Assuming req.user is populated by middleware

    if (!userId) {
      res.status(403).json({ error: 'No authorization' });
      return;
    }

    // Basic validation for date and serviceId
    if (!date || !serviceId) {
      res.status(400).json({ error: 'Date and service are required.' });
      return;
    }
    if (!userName || typeof userName !== 'string' || userName.trim().length < 2) {
      res.status(400).json({ error: 'Imię i nazwisko są wymagane.' });
      return;
    }
    const newAppointmentDate = new Date(date);
    const userPhone = req.body.userPhone;
    if (!userPhone || typeof userPhone !== 'string' || userPhone.trim().length < 2) {
      res.status(400).json({ error: 'Telefon jest wymagany.' });
      return;
    }
    // Optional: Add more robust validation here for date/time conflicts
    // This could involve checking available hours for the selected date and time,
    // and ensuring the new appointment doesn't overlap with existing ones.
    // However, this is often handled by the frontend's hour selection logic.

    const appointment = new Appointment({
      userId,
      serviceId,
      date: newAppointmentDate,
      notes,
      userName: userName,
      userPhone: userPhone // Include notes if provided
    });



    await appointment.save();

    

    // Populate userId and serviceId to return complete object to frontend
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('userId', 'firstName lastName phoneNumber username') // Include necessary user fields
      .populate('serviceId', 'name duration price'); // Include necessary service fields

    res.status(201).json({
      message: 'Appointment saved',
      appointment: populatedAppointment
    });
  } catch (err: any) { // Type 'err' as 'any' or 'Error'
    console.error('Error creating appointment:', err);
    // More specific error messages can be added based on err.code or err.name
    res.status(400).json({ error: 'Error creating appointment', details: err.message || 'Unknown error' });
  }
};

// GET /api/appointments
export const getUserAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId; // Assuming req.user is populated by middleware

    if (!userId) {
      res.status(403).json({ error: 'No authorization' });
      return;
    }

    const appointments = await Appointment.find({ userId })
      .populate('serviceId', 'name duration price') // Populate service details
      .populate('userId', 'firstName lastName phoneNumber username') // Populate user details
      .sort({ date: 1 }); // Sort by date ascending

    res.status(200).json(appointments);
  } catch (err: any) {
    console.error('Error fetching user appointments:', err);
    res.status(500).json({ error: 'Error fetching appointments', details: err.message || 'Unknown error' });
  }
};
// GET /api/appointments/occupied?date=YYYY-MM-DD
export const getOccupiedHours = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Invalid date format' });
      return;
    }

    const dayStart = new Date(date + 'T00:00:00');
    const dayEnd = new Date(date + 'T23:59:59');

    const appointments = await Appointment.find({
      date: { $gte: dayStart, $lte: dayEnd }
    });

    const occupiedHours = appointments.map(a => {
      const hour = new Date(a.date).toTimeString().slice(0, 5); // "HH:MM"
      return hour;
    });

    res.status(200).json({ occupiedHours });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching occupied hours' });
  }
};
// GET /api/appointments/fully-booked?month=YYYY-MM
export const getFullyBookedDates = async (req: Request, res: Response): Promise<void> => {
  const { month } = req.query;

  if (!month || typeof month !== 'string') {
    res.status(400).json({ error: 'No "month" parameter (e.g. 2025-06)' });
    return;
  }

  try {
    const hourDocs = await AvailableHour.find().lean();
    const availableHours = hourDocs.map(h => h.time);
    const HOURS_PER_DAY = availableHours.length;

    if (HOURS_PER_DAY === 0) {
      res.status(500).json({ error: 'No available hours configured' });
      return;
    }

    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(new Date(start).setMonth(start.getMonth() + 1));

    const appointments = await Appointment.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lt: end,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gte: HOURS_PER_DAY },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
        },
      },
    ]);

    const fullyBooked = appointments.map((a) => a.date);
    res.status(200).json({ dates: fullyBooked });
  } catch (err) {
    console.error('Error in getFullyBookedDates:', err);
    res.status(500).json({ error: 'Error fetching fully booked dates' });
  }
};
export const deleteAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId; // Get logged-in user's ID

  if (!userId) {
      res.status(403).json({ error: 'No authorization' });
    return;
  }

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({ error: 'Rezerwacja nie znaleziona.' });
      return;
    }

    // Authorization check: Only the owner or an admin can delete
    // Assuming req.user also has a 'role' property
    if (appointment.userId.toString() !== userId && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Brak uprawnień do usunięcia tej rezerwacji.' });
      return;
    }

    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Usunięto rezerwację.' });
  } catch (err: any) {
    console.error('Błąd usuwania rezerwacji:', err);
    res.status(500).json({ error: 'Błąd usuwania rezerwacji.', details: err.message || 'Unknown error' });
  }
};


export const updateAppointment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, serviceId, notes, userName } = req.body; // Added 'notes'
  const userId = req.user?.userId; // Get logged-in user's ID
  const userPhone = req.body.userPhone;
  if (!userId) {
    res.status(403).json({ error: 'No authorization' });
    return;
  }

  if (!date || !serviceId) {
    res.status(400).json({ error: 'Brakuje wymaganych danych (date, serviceId).' });
    return;
  }

  if (!userPhone || typeof userPhone !== 'string' || userPhone.trim().length < 2) {
    res.status(400).json({ error: 'Telefon jest wymagany.' });
    return;
  }
  try {
    const appointmentToUpdate = await Appointment.findById(id);

    if (!appointmentToUpdate) {
      res.status(404).json({ error: 'Rezerwacja nie znaleziona.' });
      return;
    }

    // Authorization check: Only the owner or an admin can update
    if (appointmentToUpdate.userId.toString() !== userId && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Brak uprawnień do edycji tej rezerwacji.' });
      return;
    }

    const newDate = new Date(date);

    // Validate if the new date/time slot is available (if changing the time)
    // You might want to re-check if the chosen newDate/Time is available.
    // The frontend should ideally prevent selecting occupied hours,
    // but a backend check is good for robustness.

    // Get available hours configuration
    const hourDocs = await AvailableHour.find().lean();
    const availableHourStrings = hourDocs.map(h => h.time);
    const HOURS_PER_DAY = availableHourStrings.length;

    if (HOURS_PER_DAY === 0) {
      res.status(500).json({ error: 'Brak skonfigurowanych godzin pracy.' });
      return;
    }

    const newDateDayStart = new Date(newDate);
    newDateDayStart.setHours(0, 0, 0, 0);

    const newDateDayEnd = new Date(newDate);
    newDateDayEnd.setHours(23, 59, 59, 999);

    // Find appointments on the *new* day, excluding the current appointment being updated
    const appointmentsOnNewDay = await Appointment.find({
      _id: { $ne: id }, // Exclude the current appointment
      date: { $gte: newDateDayStart, $lte: newDateDayEnd },
    });

    const newAppointmentHour = newDate.toTimeString().slice(0, 5); // "HH:MM"

    // Check if the specific new time slot is already occupied by another appointment
    const isNewTimeSlotOccupied = appointmentsOnNewDay.some(
      (a: any) => new Date(a.date).toTimeString().slice(0, 5) === newAppointmentHour
    );

    if (isNewTimeSlotOccupied) {
      res.status(400).json({ error: 'Wybrana godzina jest już zajęta.' });
      return;
    }

    // Check if the new date becomes fully booked after this update (optional, but good)
    if (appointmentsOnNewDay.length >= HOURS_PER_DAY - 1 && !availableHourStrings.includes(newAppointmentHour)) {
      res.status(400).json({ error: 'Wybrany dzień jest już w pełni zarezerwowany dla tej godziny.' });
      return;
    }


    // Update the reservation
    const updated = await Appointment.findByIdAndUpdate(
      id,
      { date: newDate, serviceId, notes, userName, userPhone }, // Include notes in update
      { new: true } // Return the updated document
    ).populate('serviceId', 'name duration price')
     .populate('userId', 'firstName lastName phoneNumber username'); // Populate user data

    if (!updated) {
      // This should ideally be caught by the findById earlier, but a safeguard
      res.status(404).json({ error: 'Rezerwacja nie znaleziona po aktualizacji.' });
      return;
    }

    res.status(200).json({
      message: 'Rezerwacja zaktualizowana.',
      appointment: updated
    });
  } catch (err: any) {
    console.error('Błąd edycji rezerwacji:', err);
    res.status(500).json({ error: 'Błąd edycji rezerwacji.', details: err.message || 'Unknown error' });
  }
};