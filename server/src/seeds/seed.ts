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
  {
    name: "Green Tea",
    type: "Green",
    description:
      "A delicate tea made from unoxidized leaves, rich in antioxidants.",
    caffeineLevel: "Medium",
    brewTempCelsius: "80",
    brewTempFahrenheit: "176",
    brewTimeMinutes: "2",
    flavorNotes: "Grassy, Vegetal",
    looseLeafRecipe:
      "Use 1 teaspoon of loose leaves per 8 oz water. Steep at 80°C (176°F) for 2-3 minutes.",
    usage: "Relaxation and antioxidants",
  },
  {
    name: "Oolong",
    type: "Oolong",
    description:
      "A partially fermented tea with a flavor profile between green and black tea.",
    caffeineLevel: "Medium",
    brewTempCelsius: "85",
    brewTempFahrenheit: "185",
    brewTimeMinutes: "4",
    flavorNotes: "Floral, Fruity, Sweet",
    looseLeafRecipe:
      "Use 1 teaspoon of loose leaves per 8 oz water. Steep at 85°C (185°F) for 4 minutes.",
    usage: "Focus and relaxation",
  },
  {
    name: "Chai",
    type: "Spiced Black",
    description:
      "A spiced black tea blend often brewed with milk and sugar for a rich, creamy experience.",
    caffeineLevel: "High",
    brewTempCelsius: "100",
    brewTempFahrenheit: "212",
    brewTimeMinutes: "5",
    flavorNotes: "Spicy, Sweet, Creamy",
    looseLeafRecipe:
      "Use 1-2 teaspoons of loose leaves per 8 oz water. Steep at 100°C (212°F) for 5 minutes.",
    usage: "Energy boost and warming",
  },
  {
    name: "White Tea",
    type: "White",
    description:
      "A light and subtle tea made from the young leaves of the tea plant.",
    caffeineLevel: "Low",
    brewTempCelsius: "70",
    brewTempFahrenheit: "158",
    brewTimeMinutes: "2",
    flavorNotes: "Floral, Light, Sweet",
    looseLeafRecipe:
      "Use 1 teaspoon of loose leaves per 8 oz water. Steep at 70°C (158°F) for 2-3 minutes.",
    usage: "Relaxation and skin health",
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

    await TeaCategory.insertMany(teaData);
    console.log("DB seeded with Tea!!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};

seedDatabase();
