import { JwtPayload } from 'jsonwebtoken';

declare global {
  declare namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: 'admin' | 'client';
      };
    }
  }
}
