import { Request, Response } from "express";
import Tea from "../models/TeaCategory";
import User from "../models/User";

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("favoriteTeas");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Extract tea types from favorite teas
    const favoriteTypes = user.favoriteTeas.map((tea: any) => tea.type); // Ensure field is `type`

    // Recommend other teas of the same type, excluding those already in favorites
    const recommendedTeas = await Tea.find({
      teaType: { $in: favoriteTypes },
      _id: { $nin: user.favoriteTeas.map((tea: any) => tea._id) },
    }).limit(5); // Limit to 5 recommendations

    res.status(200).json({ recommendedTeas });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
