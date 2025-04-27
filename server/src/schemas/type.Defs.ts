// server/src/schemas/typeDefs.ts
const typeDefs = gql`
  type Tea {
    _id: ID!
    name: String!
    brand: String!
    type: String!
    imageUrl: String
    tastingNotes: String
    tags: [String]
    createdBy: ID!
  }

  type Query {
    teas: [Tea]
    tea(id: ID!): Tea
  }

  type Mutation {
    addTea(
      name: String!,
      brand: String!,
      type: String!,
      imageUrl: String,
      tastingNotes: String,
      tags: [String]
    ): Tea
  }
`;
