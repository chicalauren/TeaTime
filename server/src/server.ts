import express from "express";
import path from "path";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connection";
import typeDefs from "./schemas/typeDefs";
import resolvers from "./schemas/resolvers";
import { authMiddleware } from "./utils/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || ''; // fallback if .env is missing

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const { user } = authMiddleware({ req });
        return { user }; // ✅ Consistent context
      },
    })
  );

  await connectDB();
   // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve(); // root: /opt/render/project/src
  const clientPath = path.join(__dirname, 'client', 'dist');
  
  app.use(express.static(clientPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

  app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
//ADDING THIS COMMENT TO COMMIT IT DEPLOYED TO RENDER