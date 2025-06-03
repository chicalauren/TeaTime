import User from "../models/User";
import { IUser } from "../models/User";
import TeaCategory from "../models/TeaCategory";
import SpillPost from "../models/SpillPost";
import { signToken } from "../utils/auth";
import { AuthenticationError } from "apollo-server-express";
import { generateRecommendations } from "../utils/generateTeaRecomendations";

const resolvers = {
  Query: {
    userByUsername: async (_: any, { username }: any) => {
      return User.findOne({ username }).populate("favoriteTeas");
    },
    me: async (_: any, __: any, context: any) => {
      if (context.user) {
        return User.findById(context.user._id)
          .select(
            "_id username email bio favoriteTeaSource favoriteTeas profileImage"
          )
          .populate("favoriteTeas")
          .populate("friends")
          .populate("friendRequestsSent")
          .populate("friendRequestsReceived");
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
    sendFriendRequest: async (_: any, { userId }: any, context: any) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");
      if (context.user._id === userId)
        throw new Error("Cannot friend yourself");

      const user = await User.findById(context.user._id);
      const target = await User.findById(userId);

      if (!user || !target) throw new Error("User not found");

      // Prevent duplicate requests or already friends
      if (
        (user as any).friends.map(String).includes(String(userId)) ||
        (user as any).friendRequestsSent.map(String).includes(String(userId)) ||
        (target as any).friendRequestsReceived
          .map(String)
          .includes(String(context.user._id))
      ) {
        throw new Error("Already friends or request pending");
      }

      (user as any).friendRequestsSent.push(userId);
      (target as any).friendRequestsReceived.push(context.user._id);

      await user.save();
      await target.save();

      return target;
    },

    acceptFriendRequest: async (_: any, { userId }: any, context: any) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      const user = await User.findById(context.user._id);
      const requester = await User.findById(userId);

      if (!user || !requester) throw new Error("User not found");

      // Remove from requests
      (user as any).friendRequestsReceived = (
        user as any
      ).friendRequestsReceived.filter((id: any) => id.toString() !== userId);
      (requester as any).friendRequestsSent = (
        requester as any
      ).friendRequestsSent.filter(
        (id: any) => id.toString() !== context.user._id
      );

      // Add to friends
      (user as any).friends.push(userId);
      (requester as any).friends.push(context.user._id);

      await user.save();
      await requester.save();

      // Fetch and return the updated, fully populated user
      const updatedUser = await User.findById(context.user._id)
        .populate("friends")
        .populate("friendRequestsSent")
        .populate("friendRequestsReceived");

      return updatedUser;
    },

    declineFriendRequest: async (_: any, { userId }: any, context: any) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      const user = await User.findById(context.user._id);
      const requester = await User.findById(userId);

      if (!user || !requester) throw new Error("User not found");

      // Remove from requests
      (user as any).friendRequestsReceived = (
        user as any
      ).friendRequestsReceived.filter((id: any) => id.toString() !== userId);
      (requester as any).friendRequestsSent = (
        requester as any
      ).friendRequestsSent.filter(
        (id: any) => id.toString() !== context.user._id
      );

      await user.save();
      await requester.save();

      return user;
    },

    removeFriend: async (_: any, { userId }: any, context: any) => {
      if (!context.user) throw new AuthenticationError("You must be logged in");

      const user = await User.findById(context.user._id);
      const friend = await User.findById(userId);

      if (!user || !friend) throw new Error("User not found");

      (user as any).friends = (user as any).friends.filter(
        (id: any) => id.toString() !== userId
      );
      (friend as any).friends = (friend as any).friends.filter(
        (id: any) => id.toString() !== context.user._id
      );

      await user.save();
      await friend.save();

      return user;
    },

    register: async (
      _: any,
      { username, email, password, securityQuestion, securityAnswer }: any
    ) => {
      try {
        const existingUser = await User.findOne({
          $or: [{ username }, { email }],
        });
        if (existingUser) {
          throw new Error("Username or email already exists");
        }

        const user = await User.create({
          username,
          email,
          password,
          securityQuestion,
          securityAnswer,
        });

        const token = signToken(user);

        return { token, user };
      } catch (error: any) {
        throw new Error(error.message || "Failed to register user");
      }
    },
    getSecurityQuestion: async (
      _: any,
      { email }: { email: string },
      { dataSources }: { dataSources: { userAPI: any } }
    ) => {
      try {
        const user = await dataSources.userAPI.findByEmail(email);
        if (!user) {
          console.warn(`User not found for email: ${email}`);

          return null;
        }

        return {
          _id: user._id,
          securityQuestion: user.securityQuestion,
        };
      } catch (error) {
        console.error("getSecurityQuestion error:", error);
        throw new Error("Failed to fetch security question.");
      }
    },

    updateUser: async (
      _: any,
      {
        bio,
        favoriteTeaSource,
        profileImage,
      }: { bio?: string; favoriteTeaSource?: string; profileImage?: string },
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

    login: async (_: any, { login, password }: any) => {
      const user = (await User.findOne({
        $or: [{ email: login }, { username: login }],
      })) as IUser;

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
