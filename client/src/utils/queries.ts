import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
    }
  }
`;

export const GET_TEAS = gql`
  query GetTeas {
    teas {
      _id
      name
      brand
      type
      imageUrl
      tastingNotes
      tags
      createdBy
      createdAt
    }
  }
`;

export const GET_TEA = gql`
  query GetTea($id: ID!) {
    tea(id: $id) {
      _id
      name
      brand
      type
      imageUrl
      tastingNotes
      tags
      createdBy
      createdAt
    }
  }
`;

export const GET_SPILL_POSTS = gql`
  query GetSpillPosts {
    spillPosts {
      _id
      title
      content
      createdAt
      createdByUsername
      likes
      comments {
        content
        createdByUsername
        createdAt
      }
    }
  }
`;
export const RECOMMEND_TEAS = gql`
  query RecommendTeas($tags: [String!]!) {
    recommendTeas(tags: $tags) {
      _id
      name
      brand
      type
      imageUrl
      tags
    }
  }
`;
