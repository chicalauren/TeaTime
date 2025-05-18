import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
console.log("🧪 Loaded MONGODB_URI:", process.env.MONGODB_URI);

import mongoose from "mongoose";
import TeaCategory from "../models/TeaCategory";
import User from "../models/User";
import connectDB from "../config/connection";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables.");
}

mongoose.set("strictQuery", false);

const teaData = [
  {
    name: "Earl Grey",
    type: "Black",
    description: "A bold black tea infused with the oil of bergamot, giving it a distinct citrusy aroma.",
    caffeineLevel: "High",
    brewTempCelsius: "95",
    brewTempFahrenheit: "203",
    brewTimeMinutes: "3",
    flavorNotes: "Citrus, Malty, Floral",
    looseLeafRecipe: "Use 1 teaspoon of loose leaves per 8 oz water. Steep at 95°C (203°F) for 3–5 minutes.",
    usage: "focus and energy",
    imageUrl: "/images/earl-grey.jpg"
  },
  {
    name: "Chamomile",
    type: "Herbal",
    description: "A sweet, floral herbal tea known for its calming properties.",
    caffeineLevel: "Low",
    brewTempCelsius: "90",
    brewTempFahrenheit: "194",
    brewTimeMinutes: "5",
    flavorNotes: "Floral, almost Apple-like",
    looseLeafRecipe: "Use 1 tablespoon of dried chamomile flowers per 8 oz water. Steep at 90°C (194°F) for 5 minutes.",
    usage: "Sleepy Time and stress relief",
    imageUrl: "/images/chamomile.jpg"
  },
  {
    name: "Peppermint",
    type: "Herbal",
    description: "A cooling herbal tea made from peppermint leaves, often used to ease digestion.",
    caffeineLevel: "Low",
    brewTempCelsius: "95",
    brewTempFahrenheit: "203",
    brewTimeMinutes: "5",
    flavorNotes: "Minty and Cooling",
    looseLeafRecipe: "Use 1 tablespoon of dried peppermint leaves per 8 oz water. Steep at 95°C (203°F) for 5 minutes.",
    usage: "Digestion support and very refreshing",
    imageUrl: "/images/peppermint.jpg"
  },
  {
    name: "Green Tea",
    type: "Green",
    description: "A delicate tea made from unoxidized leaves, rich in antioxidants.",
    caffeineLevel: "Medium",
    brewTempCelsius: "80",
    brewTempFahrenheit: "176",
    brewTimeMinutes: "2",
    flavorNotes: "Grassy, Vegetal",
    looseLeafRecipe: "Use 1 teaspoon of loose leaves per 8 oz water. Steep at 80°C (176°F) for 2-3 minutes.",
    usage: "Relaxation and antioxidants",
    imageUrl: "/images/green-tea.jpg"
  },
  {
    name: "Oolong",
    type: "Oolong",
    description: "A partially fermented tea with a flavor profile between green and black tea.",
    caffeineLevel: "Medium",
    brewTempCelsius: "85",
    brewTempFahrenheit: "185",
    brewTimeMinutes: "4",
    flavorNotes: "Floral, Fruity, Sweet",
    looseLeafRecipe: "Use 1 teaspoon of loose leaves per 8 oz water. Steep at 85°C (185°F) for 4 minutes.",
    usage: "Focus and relaxation",
    imageUrl: "/images/oolong.jpg"
  },
  {
    name: "Chai",
    type: "Spiced Black",
    description: "A spiced black tea blend often brewed with milk and sugar for a rich, creamy experience.",
    caffeineLevel: "High",
    brewTempCelsius: "100",
    brewTempFahrenheit: "212",
    brewTimeMinutes: "5",
    flavorNotes: "Spicy, Sweet, Creamy",
    looseLeafRecipe: "Use 1-2 teaspoons of loose leaves per 8 oz water. Steep at 100°C (212°F) for 5 minutes.",
    usage: "Energy boost and warming",
    imageUrl: "/images/chai.jpg"
  },
  {
    name: "White Tea",
    type: "White",
    description: "A light and subtle tea made from the young leaves of the tea plant.",
    caffeineLevel: "Low",
    brewTempCelsius: "70",
    brewTempFahrenheit: "158",
    brewTimeMinutes: "2",
    flavorNotes: "Floral, Light, Sweet",
    looseLeafRecipe: "Use 1 teaspoon of loose leaves per 8 oz water. Steep at 70°C (158°F) for 2-3 minutes.",
    usage: "Relaxation and skin health",
    imageUrl: "/images/white-tea.jpg"
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // ✅ Clear existing tea entries before inserting new ones
    await TeaCategory.deleteMany();
    console.log("🧹 Cleared old tea data");

    // Insert teas
    const insertedTeas = await TeaCategory.insertMany(teaData);
    console.log(`✅ Inserted ${insertedTeas.length} tea categories`);

    await User.deleteOne({ username: "testuser" });

    // Create fake user
    const fakeUser = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      favoriteTeas: [insertedTeas[0]._id], // e.g., Earl Grey
    });

    console.log(`✅ Created user: ${fakeUser.username}`);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding the database:", error);
    process.exit(1);
  }
};


seedDatabase();
