import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    favoriteTeas: [TeaCategory]
    bio: String
    favoriteTeaSource: String
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

  type Comment {
    _id: ID!
    content: String!
    createdByUsername: String!
    createdAt: String!
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

  # Queries
  type Query {
    me: User
    teas: [TeaCategory]
    tea(id: ID!): TeaCategory
    spillPosts: [SpillPost]
    recommendTeas(tags: [String!]!): [TeaCategory]
  }

  # Mutations
  type Mutation {
    login(email: String!, password: String!): Auth
    register(username: String!, email: String!, password: String!): Auth
    updateUser(bio: String, favoriteTeaSource: String): User

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
