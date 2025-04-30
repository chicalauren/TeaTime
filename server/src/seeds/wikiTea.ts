import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import TeaCategory from "../models/TeaCategory";
dotenv.config();

export default async function seedWikiTeas() {
  await mongoose.connect(process.env.MONGODB_URI!);

  // Fetch wiki category members
  const { data: cat } = await axios.get("https://en.wikipedia.org/w/api.php", {
    params: {
      action: "query",
      format: "json",
      list: "categorymembers",
      cmtitle: "Category:Tea_varieties",
      cmlimit: 50,
      origin: "*",
    },
  });

  const titles: string[] = cat.query.categorymembers.map((m: any) => m.title);

  for (const title of titles) {
    // Skip if already in DB
    if (await TeaCategory.exists({ name: title })) continue;

    // Fetch page extract
    const { data: ex } = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        format: "json",
        prop: "extracts",
        titles: title.replace(/ /g, "_"),
        exintro: 1,
        explaintext: 1,
        origin: "*",
      },
    });

    const pages = ex.query.pages;
    const page = Object.values(pages)[0] as any;
    if (page.missing) continue;

    await TeaCategory.create({
      name: page.title,
      description: page.extract,
      // leave other fields blank or add defaults
    });
    console.log(`✅ Wiki-seeded: ${page.title}`);
  }

  await mongoose.disconnect();
  console.log("✅ Wiki teas seeded");
}
