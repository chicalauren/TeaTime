import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      bio
      favoriteTeaSource
      favoriteTeas {
        _id
        name
        imageUrl
        type
        tags
      }
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
      rating
      favorite
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

export const GET_USER_BY_USERNAME = gql`
  query UserByUsername($username: String!) {
    userByUsername(username: $username) {
      _id
      username
      email
      bio
      favoriteTeaSource
    }
  }
`;

export const GET_ME_WITH_FRIENDS = gql`
  query Me {
    me {
      _id
      username
      friends { _id username }
      friendRequestsSent { _id username }
      friendRequestsReceived { _id username }
      # ...other fields
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
        _id
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
