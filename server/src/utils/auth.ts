import jwt from 'jsonwebtoken';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET!;
const expiration = '2h';

interface UserPayload {
  _id: string;
  email: string;
  username: string;
}

export function signToken({ _id, email, username }: UserPayload) {
  const payload = { _id, email, username };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

export function authMiddleware({ req }: { req: Request }) {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token
  if (!token) {
    return { req }; // No token, user is not authenticated
  }

  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET!) as { data: { _id: string; username: string; email: string } };
    (req as any).user = data; // Attach user to req
  } catch (err) {
    console.error('Invalid or expired token');
  }

  return { req };
}
