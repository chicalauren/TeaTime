import express from "express";
import path from "path";
import { fileURLToPath } from "url";

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
import jwt from "jsonwebtoken";
import connectDB from "./config/connection.js";
import typeDefs from "./schemas/typeDefs.js";
import resolvers from "./schemas/resolvers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || ""; // fallback if .env is missing

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => authMiddleware({ req }),
    })
  );

  await connectDB();

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, "../../../client/dist")));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../../../client/dist/index.html"));
    });
  }

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, "../../../client/dist")));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "../../../client/dist/index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
