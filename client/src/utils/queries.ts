import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      id
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
      createdByUsername
      createdAt
    }
  }
`;

export const GET_SPILL_POSTS = gql`
  query GetSpillPosts {
    spillPosts {
      id
      title
      content
      likes
      createdByUsername
      createdAt
      comments {
        id
        content
        createdByUsername
        createdAt
      }
    }
  }
`;
