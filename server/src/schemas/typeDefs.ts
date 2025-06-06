import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    profileImage: String
    favoriteTeas: [TeaCategory]
    friends: [User]
    friendRequestsSent: [User]
    friendRequestsReceived: [User]
    bio: String
    favoriteTeaSource: String
  }

  type Message {
    _id: ID!
    sender: User!
    content: String!
    timestamp: String!
    readBy: [User!]!
  }

  type MessageThread {
    _id: ID!
    participants: [User!]!
    messages: [Message!]!
    updatedAt: String!
  }

  type TeaCategory {
    _id: ID!
    name: String!
    brand: String
    type: String!
    imageUrl: String
    tastingNotes: String
    tags: [String]
    description: String
    caffeineLevel: String
    brewTempCelsius: Int
    brewTimeSeconds: Int
    createdBy: ID
    createdAt: String
    rating: Int
    favorite: Boolean
  }

  type Reaction {
    emoji: String!
    users: [String!]!
  }

  type Comment {
    _id: ID!
    content: String!
    createdByUsername: String!
    createdAt: String!
    reactions: [Reaction]
  }

  type SpillPost {
    _id: ID!
    title: String!
    content: String!
    createdBy: ID
    createdByUsername: String
    comments: [Comment]
    likes: Int
    likedBy: [ID!]!
    createdAt: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  # Added this in - not sure if Auth is needed
  type AuthPayload {
    token: String!
    user: User!
  }

  # Queries
  type Query {
    me: User
    teas: [TeaCategory]
    tea(id: ID!): TeaCategory
    spillPosts: [SpillPost]
    recommendTeas(tags: [String!]!): [TeaCategory]
    userByUsername(username: String!): User
    myMessageThreads: [MessageThread!]!
    searchUsers(username: String!): [User]
    messageThreadWith(userId: ID!): MessageThread
  }

  # Mutations
  type Mutation {
    login(login: String!, password: String!): AuthPayload!
    sendFriendRequest(userId: ID!): User
    acceptFriendRequest(userId: ID!): User
    declineFriendRequest(userId: ID!): User
    removeFriend(userId: ID!): User
    register(username: String!, email: String!, password: String!): Auth
    editSpillPost(spillPostId: ID!, title: String, content: String): SpillPost
    editComment(spillPostId: ID!, commentId: ID!, content: String!): SpillPost
    sendMessage(toUserId: ID!, content: String!): MessageThread!
    markThreadAsRead(threadId: ID!): MessageThread!
    reactToComment(spillPostId: ID!, commentId: ID!, emoji: String!): SpillPost
    updateUser(
      bio: String
      favoriteTeaSource: String
      profileImage: String
    ): User

    addTea(
      name: String!
      brand: String
      type: String!
      imageUrl: String
      tastingNotes: String
      tags: [String]
      rating: Int
      favorite: Boolean
    ): TeaCategory

    addTeaToFavorites(teaId: ID!): User
    removeTeaFromFavorites(teaId: ID!): User

    recommendTeas(tags: [String!]!): [TeaCategory]
    updateTeaRating(teaId: ID!, rating: Int!): TeaCategory
    updateTeaTags(teaId: ID!, tags: [String!]!): TeaCategory
    updateTeaDescription(teaId: ID!, description: String!): TeaCategory

    updateTea(
      teaId: ID!
      name: String
      brand: String
      type: String
      rating: Int
      tags: [String]
      favorite: Boolean
      imageUrl: String
    ): TeaCategory

    deleteTea(id: ID!): TeaCategory

    deleteComment(spillPostId: ID!, commentId: ID!): SpillPost

    addSpillPost(title: String!, content: String!): SpillPost
    deleteSpillPost(spillPostId: ID!): SpillPost
    addComment(spillPostId: ID!, content: String!): SpillPost
    likeSpillPost(spillPostId: ID!): SpillPost
  }
`;

export default typeDefs;
