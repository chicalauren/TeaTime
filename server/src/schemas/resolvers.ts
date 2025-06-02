import User from "../models/User";
import { IUser } from "../models/User";
import TeaCategory from "../models/TeaCategory";
import SpillPost from "../models/SpillPost";
import { signToken } from "../utils/auth";
import { AuthenticationError } from "apollo-server-express";
import { generateRecommendations } from "../utils/generateTeaRecomendations";

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (context.user) {
        return User.findById(context.user._id)
          .select(
            "_id username email bio favoriteTeaSource favoriteTeas profileImage"
          )
          .populate("favoriteTeas");
      }
      throw new AuthenticationError("You must be logged in");
    },
    teas: async () => TeaCategory.find(),
    tea: async (_: any, { id }: { id: string }) => TeaCategory.findById(id),
    spillPosts: async () => SpillPost.find().sort({ createdAt: -1 }),

    recommendTeas: async (
      _parent: unknown,
      _args: any,
      context: { user?: { _id: string } }
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }

      // Only pass user._id here
      const recommendedTeas = await generateRecommendations(context.user._id);

      return recommendedTeas;
    },
  },

  Mutation: {
    register: async (_: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    updateUser: async (
      _: any,
        { bio, favoriteTeaSource, profileImage }: { bio?: string; favoriteTeaSource?: string; profileImage?: string },
        context: any
      ) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }

      const updatedFields: Partial<IUser> = {};
      if (bio !== undefined) updatedFields.bio = bio;
      if (favoriteTeaSource !== undefined)
        updatedFields.favoriteTeaSource = favoriteTeaSource;
      if (profileImage !== undefined) updatedFields.profileImage = profileImage;

      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $set: updatedFields },
        { new: true }
      );

      return updatedUser;
    },

    login: async (_: any, { email, password }: any) => {
      const user = (await User.findOne({ email })) as IUser;
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken({
        _id: user._id,
        email: user.email,
        username: user.username,
      });
      return { token, user };
    },

    addTea: async (
      _: any,
      { name, brand, type, imageUrl, tastingNotes, tags, favorite }: any,
      context: any
    ) => {
      console.log(context);
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }

      const tea = await TeaCategory.create({
        name,
        brand,
        type,
        imageUrl,
        tastingNotes,
        tags,
        createdBy: context.user._id,
      });

      if (favorite) {
        await User.findByIdAndUpdate(context.user._id, {
          $addToSet: { favoriteTeas: tea._id },
        });
      }

      return tea;
    },
    addTeaToFavorites: async (
      _: any,
      { teaId }: { teaId: string },
      context: { user?: { _id: string } }
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { favoriteTeas: teaId } },
        { new: true }
      ).populate("favoriteTeas");
      return user;
    },
    removeTeaFromFavorites: async (
      _: any,
      { teaId }: { teaId: string },
      context: { user?: { _id: string } }
    ) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in");
      }
      const user = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { favoriteTeas: teaId } },
        { new: true }
      ).populate("favoriteTeas");
      return user;
    },

    updateTea: async (_: any, { teaId, ...fields }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }
      if (!teaId) {
        throw new Error("Tea ID (teaId) is required");
      }

      console.log(teaId, fields);

      const updatedTea = await TeaCategory.findByIdAndUpdate(teaId, fields, {
        new: true,
      });

      if (updatedTea?.favorite) {
        await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { favoriteTeas: teaId } },
          { new: true }
        ).populate("favoriteTeas");
      } else {
        await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { favoriteTeas: teaId } },
          { new: true }
        ).populate("favoriteTeas");
      }

      return updatedTea;
    },

    deleteTea: async (_: any, { id }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }
      return TeaCategory.findByIdAndDelete(id);
    },

    addSpillPost: async (_: any, { title, content }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }

      const newPost = await SpillPost.create({
        title,
        content,
        createdBy: context.user._id,
        createdByUsername: context.user.username,
      });

      return newPost;
    },
    deleteSpillPost: async (
      _: any,
      { spillPostId }: { spillPostId: string },
      context: any
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }
      const post = await SpillPost.findById(spillPostId);

      if (!post) {
        throw new Error("Spill post not found");
      }
      if (String(post.createdBy) !== String(context.user._id)) {
        throw new AuthenticationError("Not authorized to delete this post");
      }

      await SpillPost.findByIdAndDelete(spillPostId);

      return post; // return deleted post data per typeDefs
    },

    addComment: async (_: any, { spillPostId, content }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }

      const newComment = {
        content,
        createdByUsername: context.user.username || "Anonymous",
        createdAt: new Date(),
      };

      const updatedPost = await SpillPost.findByIdAndUpdate(
        spillPostId,
        { $push: { comments: newComment } },
        { new: true }
      );

      return updatedPost;
    },

    likeSpillPost: async (_: any, { spillPostId }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }

      const post = await SpillPost.findById(spillPostId);
      if (!post) {
        throw new Error("Spill post not found");
      }

      const userId = context.user._id.toString();
      const likedIndex = post.likedBy.findIndex(
        (id: any) => id.toString() === userId
      );

      if (likedIndex !== -1) {
        // User already liked: unlike
        post.likedBy.splice(likedIndex, 1);
        post.likes = Math.max((post.likes || 1) - 1, 0);
      } else {
        // User has not liked: like
        post.likedBy.push(userId);
        post.likes = (post.likes || 0) + 1;
      }

      await post.save();
      return post;
    },

    deleteComment: async (
      _: any,
      { spillPostId, commentId }: any,
      context: any
    ) => {
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }
      return SpillPost.findByIdAndUpdate(
        spillPostId,
        {
          $pull: {
            comments: {
              _id: commentId,
              createdByUsername: context.user.username,
            },
          },
        },
        { new: true }
      );
    },
  },
};

export default resolvers;
