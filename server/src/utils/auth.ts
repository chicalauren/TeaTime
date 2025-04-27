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
  let token = req.headers.authorization?.split(' ').pop() || '';

  if (!token) {
    return { req };
  }

  try {
    const { data } = jwt.verify(token, secret) as { data: UserPayload };
    (req as any).user = data; // 🔥 🔥 🔥 ATTACH user to req
  } catch (err) {
    console.error('Invalid token');
  }

  return { req };
}
