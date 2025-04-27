import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;
export const ADD_TEA = gql`
  mutation AddTea(
    $name: String!,
    $brand: String!,
    $type: String!,
    $imageUrl: String,
    $tastingNotes: String,
    $tags: [String]
  ) {
    addTea(
      name: $name,
      brand: $brand,
      type: $type,
      imageUrl: $imageUrl,
      tastingNotes: $tastingNotes,
      tags: $tags
    ) {
      _id
      name
      brand
      type
      imageUrl
      tastingNotes
      tags
    }
  }
`;