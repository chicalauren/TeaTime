import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
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
  }

  type Comment {
    content: String!
    createdByUsername: String!
    createdAt: String
  }

  type SpillPost {
    _id: ID!
    title: String!
    content: String!
    createdBy: ID
    createdByUsername: String
    comments: [Comment]
    likes: Int
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

    addTea(
      name: String!
      brand: String
      type: String!
      imageUrl: String
      tastingNotes: String
      tags: [String]
    ): TeaCategory

    updateTea(
      id: ID!
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
    addComment(spillPostId: ID!, content: String!): SpillPost
    likeSpillPost(spillPostId: ID!): SpillPost
  }
`;

export default typeDefs;
