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

interface TokenPayload {
  id: string;
  email: string;
  username: string;
}

// 🔐 Create a JWT with mapped `id` field
export function signToken({ _id, email, username }: UserPayload) {
  const payload: TokenPayload = { id: _id, email, username };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

// 🛡️ Middleware to extract user from token and attach to GraphQL context
export function authMiddleware({ req }: { req: Request }) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token) {
    return { user: null };
  }

  try {
    const { data } = jwt.verify(token, secret) as { data: TokenPayload };
    return { user: data }; // ✅ Send user into context
  } catch (err) {
    console.error('Invalid or expired token:', err);
    return { user: null };
  }
}
