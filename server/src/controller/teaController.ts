// controller/teaController.ts
import { Request, Response } from "express";
import { generateRecommendations } from "../utils/generateTeaRecomendations";

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const recommendedTeas = await generateRecommendations(userId);
    res.status(200).json({ recommendedTeas });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
  }
};
