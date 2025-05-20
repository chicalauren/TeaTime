import User from "../models/User";
import { IUser } from "../models/User";
import TeaCategory from "../models/TeaCategory";
import SpillPost from "../models/SpillPost";
import { signToken } from "../utils/auth";
import { AuthenticationError } from "apollo-server";

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (context.user) {
        return User.findById(context.user._id);
      }
      throw new AuthenticationError("You must be logged in");
    },
    teas: async () => TeaCategory.find(),
    tea: async (_: any, { id }: { id: string }) => TeaCategory.findById(id),
    spillPosts: async () => SpillPost.find().sort({ createdAt: -1 }),
  },

  Mutation: {
    register: async (_: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
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
      if (!context.req.user) {
        // ✅ correct: req.user
        throw new AuthenticationError("Authentication required");
      }

      const tea = await TeaCategory.create({
        name,
        brand,
        type,
        imageUrl,
        tastingNotes,
        tags,
        createdBy: context.req.user._id, // ✅ context.req.user._id
      });
      if (favorite) {
        await User.findByIdAndUpdate(context.req.user._id, {
          $addToSet: { favoriteTeas: tea._id },
        });
      }
      return tea;
    },

    updateTea: async (_: any, { id, ...fields }: any, context: any) => {
      console.log("Context user:", context.user); // Debugging
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }
      return TeaCategory.findByIdAndUpdate(id, fields, { new: true });
    },

    deleteTea: async (_: any, { id }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }
      return TeaCategory.findByIdAndDelete(id);
    },

    addSpillPost: async (_: any, { title, content }: any, context: any) => {
      if (!context.req.user) {
        throw new AuthenticationError("Authentication required");
      }

      const newPost = await SpillPost.create({
        title,
        content,
        createdBy: context.req.user._id, // ✅ context.req.user._id
        createdByUsername: context.req.user.username, // ✅ context.req.user.username
      });

      console.log("New post created:", newPost); // Debugging
      console.log("Context user:", context.user); // Debugging
      console.log("Context req user:", context.req.user); // Debugging
      console.log("Context req user ID:", context.req.user._id); // Debugging
      console.log("Context req user username:", context.req.user.username); // Debugging
      console.log("Context req user email:", context.req.user.email); // Debugging
      console.log("Context req user password:", context.req.user.password); // Debugging
      return newPost;
    },

    addComment: async (_: any, { spillPostId, content }: any, context: any) => {
      console.log("Context user:", context.user); // Debugging
      if (!context.user) {
        throw new AuthenticationError("Authentication required");
      }

      const newComment = {
        content,
        createdByUsername: context.user.username || "Anonymous", // Ensure this is not null
        createdAt: new Date(),
      };

      const updatedPost = await SpillPost.findByIdAndUpdate(
        spillPostId,
        { $push: { comments: newComment } },
        { new: true } // Return the updated document
      );

      console.log("Updated post:", updatedPost); // Debugging
      return updatedPost;
    },

    likeSpillPost: async (_: any, { spillPostId }: any) => {
      return SpillPost.findByIdAndUpdate(
        spillPostId,
        { $inc: { likes: 1 } },
        { new: true }
      );
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
