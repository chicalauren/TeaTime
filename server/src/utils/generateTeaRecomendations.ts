import { Request, Response } from "express";
import Tea from "../models/TeaCategory";
import User from "../models/User";

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Pull favorite teas' tags or types
    const favoriteTeas = await Tea.find({ _id: { $in: user.favoriteTeas } });

    const preferredTypes = new Set(favoriteTeas.map((tea) => tea.type));
    const preferredTags = favoriteTeas.flatMap((tea) => tea.tags || []);

    // Recommend teas that match type or tags
    const recommendedTeas = await Tea.find({
      $or: [
        { type: { $in: Array.from(preferredTypes) } },
        { tags: { $in: preferredTags } },
      ],
      _id: { $nin: user.favoriteTeas }, // Don’t recommend teas already saved
    }).limit(5);

    res.status(200).json({ recommendedTeas });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
