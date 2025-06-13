// controllers/config.controller.ts
import { Request, Response } from 'express';
import AvailableHour from '../models/availableHour.model';
import Service from '../models/service.model';

export const getConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const hours = await AvailableHour.find().sort({ time: 1 });
    const services = await Service.find();

    res.status(200).json({
      hours: hours.map(h => h.time),
      services
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching configuration' });
  }
};
