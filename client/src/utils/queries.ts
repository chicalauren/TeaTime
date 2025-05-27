import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      bio
      favoriteTeaSource
      favoriteTea {
        name
      }
    }
  }
`;

export const GET_TEAS = gql`
  query GetTeas {
    teas {
      id
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



export const GET_TEA = gql`
  query GetTea($id: ID!) {
    tea(id: $id) {
      id
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

