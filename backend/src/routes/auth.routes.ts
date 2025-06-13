import express from 'express';
import { login, register, logout } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import User from '../models/user.model';
import type { Request, Response } from 'express';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId; // dopasuj jeśli trzymasz inaczej

    if (!userId) {
      res.status(401).json({ message: 'Brak ID użytkownika' });
      return;
    }

    const user = await User.findById(userId).select('firstName lastName phoneNumber username role');

    if (!user) {
      res.status(404).json({ message: 'Użytkownik nie znaleziony' });
      return;
    }

    res.json({
      userId: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });
  } catch (err) {
    console.error('❌ Błąd w /me:', err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});
router.post('/logout', logout);
router.put('/me', authenticate, async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: 'Brak autoryzacji' });
    return;
  }

  const { firstName, lastName, phoneNumber } = req.body;

  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !/^\d{7,15}$/.test(phoneNumber.replace(/\s/g, ''))
  ) {
    res.status(400).json({ error: 'Nieprawidłowe dane. Sprawdź pola formularza.' });
    return;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'Użytkownik nie znaleziony' });
      return;
    }

    res.json({ message: 'Dane użytkownika zaktualizowane', user: updatedUser });
  } catch (err) {
    console.error('Błąd aktualizacji profilu:', err);
    res.status(500).json({ error: 'Błąd aktualizacji profilu' });
  }
});

export default router;
