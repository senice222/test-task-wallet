import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!config.userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  next();
}; 