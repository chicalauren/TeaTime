import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET!;
const expiration = "2h";

interface UserPayload {
  _id: string;
  email: string;
  username: string;
}

export function signToken({ _id, email, username }: UserPayload) {
  const payload = { _id, email, username };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

export function authMiddleware({ req }: { req: any }) {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  if (!token) {
    return { user: null }; // No token, user is not authenticated
  }

  console.log("Received token:", token);

  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET!) as {
      data: { _id: string; username: string; email: string };
    };
    console.log("Decoded token data:", data);
    req.user = data as UserPayload; // Attach user to req
    console.log("User from token:", req.user); // Debugging
  } catch (err) {
    console.error("Invalid or expired token");
  }

  return req;
}
