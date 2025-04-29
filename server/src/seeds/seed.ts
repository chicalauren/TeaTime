const mongoose = require("mongoose");
const TeaCategory = require("../models/TeaCategory");

const teaData = [
  {
    name: "Earl Grey",
    type: "Black",
    description:
      "A bold black tea infused with the oil of bergamot, giving it a distinct citrusy aroma.",
    caffeineLevel: "High",
    brewTempCelsius: "95",
    brewTempFahrenheit: "203",
    brewTimeMinutes: "3",
    flavorNotes: "Citrus, Malty, Floral",
    looseLeafRecipe:
      "Use 1 teaspoon of loose leaves per 8 oz water. Steep at 95°C (203°F) for 3–5 minutes.",
    usage: "focus and energy",
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
    looseLeafRecipe:
      "Use 1 tablespoon of dried chamomile flowers per 8 oz water. Steep at 90°C (194°F) for 5 minutes.",
    usage: "Sleepy Time and stress relief",
  },
  {
    name: "Peppermint",
    type: "Herbal",
    description:
      "A cooling herbal tea made from peppermint leaves, often used to ease digestion.",
    caffeineLevel: "Low",
    brewTempCelsius: 95,
    brewTempFahrenheit: 203,
    brewTimeMinutes: 5,
    flavorNotes: "Minty and Cooling",
    looseLeafRecipe:
      "Use 1 tablespoon of dried peppermint leaves per 8 oz water. Steep at 95°C (203°F) for 5 minutes.",
    usage: "Digestion support and very refreshing",
  },
];
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // clearing DB
    await TeaCategory.deleteMany({});
    // adding new tea data

    await TeaCategory.insertManny(teaData);
    console.log("DB seeded with Tea!!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};

seedDatabase();
