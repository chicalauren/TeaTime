import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Me {
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
      tastingNotes
      tags
      imageUrl
    }
  }
`;