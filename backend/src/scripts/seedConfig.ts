import mongoose from 'mongoose';
import AvailableHour from '../models/availableHour.model';
import Service from '../models/service.model';

const seed = async () => {
  await mongoose.connect('mongodb://localhost:27017/salon');

  await AvailableHour.deleteMany({});
  await AvailableHour.insertMany([
    { time: '10:00' }, { time: '11:30' }, { time: '13:00' },
    { time: '14:30' }, { time: '16:00' }, { time: '17:30' }
  ]);

  await Service.deleteMany({});
  await Service.insertMany([
    { name: 'Strzyżenie', duration: 30, price: 60 },
    { name: 'Koloryzacja', duration: 90, price: 150 },
    { name: 'Stylizacja', duration: 45, price: 80 }
  ]);

  console.log('✓ Seed completed');
  await mongoose.disconnect();
};

seed();
