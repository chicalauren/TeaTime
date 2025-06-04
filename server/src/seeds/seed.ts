import dotenv from "dotenv";
import mongoose from "mongoose";
import TeaCategory from "../models/TeaCategory";
import path from "path";
import fs from "fs";
import connectDB from "../config/connection";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Ensure MONGODB_URI is defined in the environment variables
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

mongoose.connect(process.env.MONGODB_URI);

// Read the teas.json file
const teaData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../src/seeds/teas.json"), "utf-8")
);
const testUser = {
  username: "test",
  email: "test@example.com",
  password: "password123",
};

const seedDatabase = async () => {
  try {
    // Connect to DB
    await connectDB();
    await TeaCategory.deleteMany();
    console.log("🧹 Cleared old tea data");

    // Insert the tea data into the database
    const insertedTeas = await TeaCategory.insertMany(teaData);

    console.log(`Successfully inserted ${insertedTeas.length} tea categories`);

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};

seedDatabase();
