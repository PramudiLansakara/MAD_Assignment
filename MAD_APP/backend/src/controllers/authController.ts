import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';

// Register User
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const token = await registerUser(name, email, password);
    res.status(201).json({ token });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Login User
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, password } = req.body;

  try {
    const token = await loginUser(name, password);
    res.status(200).json({ token });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
  next();
};
