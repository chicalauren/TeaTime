import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const REGISTER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const DELETE_TEA = gql`
  mutation DeleteTea($id: ID!) {
    deleteTea(id: $id) {
      id
    }
  }
`;

export const ADD_TEA = gql`
  mutation addTea(
    $name: String!
    $brand: String!
    $type: String!
    $imageUrl: String
    $tastingNotes: String
    $tags: [String]
  ) {
    addTea(
      name: $name
      brand: $brand
      type: $type
      imageUrl: $imageUrl
      tastingNotes: $tastingNotes
      tags: $tags
    ) {
      id
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

export const UPDATE_TEA = gql`
  mutation updateTea(
    $id: ID!
    $name: String!
    $brand: String!
    $type: String!
    $rating: Int
    $tags: [String]
    $favorite: Boolean
    $imageUrl: String
  ) {
    updateTea(
      id: $id
      name: $name
      brand: $brand
      type: $type
      rating: $rating
      tags: $tags
      favorite: $favorite
      imageUrl: $imageUrl
    ) {
      id
      name
      brand
      type
      rating
      tags
      imageUrl
    }
  }
`;

export const ADD_SPILL_POST = gql`
  mutation AddSpillPost($title: String!, $content: String!) {
    addSpillPost(title: $title, content: $content) {
      id
      title
      content
      createdByUsername
      likes
      createdAt
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($spillPostId: ID!, $content: String!) {
    addComment(spillPostId: $spillPostId, content: $content) {
      id
      comments {
        id
        content
        createdByUsername
        createdAt
      }
    }
  }
`;

export const LIKE_SPILL_POST = gql`
  mutation LikeSpillPost($spillPostId: ID!) {
    likeSpillPost(spillPostId: $spillPostId) {
      id
      likes
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($spillPostId: ID!, $commentId: ID!) {
    deleteComment(spillPostId: $spillPostId, commentId: $commentId) {
      id
    }
  }
`;

export const DELETE_SPILL_POST = gql`
  mutation DeleteSpillPost($spillPostId: ID!) {
    deleteSpillPost(spillPostId: $spillPostId) {
      id
    }
  }
`;

export const GET_TEA = gql`
  query getTea($id: ID!) {
    tea(id: $id) {
      id
      name
      brand
      type
      rating
      tags
      favorite
      imageUrl
    }
  }
`;
