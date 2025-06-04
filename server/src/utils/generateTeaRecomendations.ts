import Tea from "../models/TeaCategory";
import User from "../models/User";

interface ITea {
  _id: string;
  type: string;
  tags?: string[];
}

interface IUser {
  _id: string;
  favoriteTeas?: string[];
  profileImage?: string;
}

export const generateRecommendations = async (userId: string) => {
  const user = (await User.findById(userId)) as IUser | null;

  if (!user) {
    throw new Error("User not found");
  }

  const favoriteTeaIds = user.favoriteTeas ?? [];
  const favoriteTeas = (await Tea.find({
    _id: { $in: favoriteTeaIds },
  })) as ITea[];
  const preferredTypes = new Set(favoriteTeas.map((tea) => tea.type));
  const preferredTags = favoriteTeas.flatMap((tea) => tea.tags || []);

  const recommendedTeas = await Tea.find({
    $or: [
      { type: { $in: Array.from(preferredTypes) } },
      { tags: { $in: preferredTags } },
    ],
    _id: { $nin: favoriteTeaIds },
  }).limit(5);

  return recommendedTeas;
};
