import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'admin' | 'client';
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: 'No authorization token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: 'admin' | 'client';
    };

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err); 
    res.status(403).json({ error: 'Invalid token' }); 
  }
};
