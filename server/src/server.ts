import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace `any` with a stricter type if you prefer
    }
  }
}

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import connectDB from "./config/connection";
import typeDefs from "./schemas/typeDefs";
import resolvers from "./schemas/resolvers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "";

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // TODO: Lauren said remove this in production
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

  app.use(express.json());

 
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(' ').pop();
        let user = null;
      
        if (token) {
          try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            user = decoded.data;
            // console.log('Token verified, user:', user);
          } catch (err) {
            if (err instanceof Error) {
              console.warn('Invalid token:', err.message);
            } else {
              console.warn('Unknown error during token verification');
            }
          }
        } else {
          console.log('No token provided');
        }
      
        req.user = user;
        return req ;
      }
      
    })
  );

  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
