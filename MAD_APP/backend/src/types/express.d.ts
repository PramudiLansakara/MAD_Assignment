import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: string; // Or use the correct type for `user`, e.g., `User` if you have a User model
    }
  }
}
