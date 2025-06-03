import { gql } from "@apollo/client";

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
export const DELETE_TEA = gql`
  mutation DeleteTea($id: ID!) {
    deleteTea(id: $id) {
      _id
    }
  }
`;
export const ADD_SPILL_POST = gql`
  mutation AddSpillPost($title: String!, $content: String!) {
    addSpillPost(title: $title, content: $content) {
      _id
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
      _id
      comments {
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
      _id
      likes
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($spillPostId: ID!, $commentId: ID!) {
    deleteComment(spillPostId: $spillPostId, commentId: $commentId) {
      _id
    }
  }
`;

export const DELETE_SPILL_POST = gql`
  mutation DeleteSpillPost($spillPostId: ID!) {
    deleteSpillPost(spillPostId: $spillPostId) {
      _id
      title
    }
  }
`;
export const LOGIN = gql`
  mutation login($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($toUserId: ID!, $content: String!) {
    sendMessage(toUserId: $toUserId, content: $content) {
      _id
      participants {
        _id
        username
        profileImage
      }
      messages {
        _id
        sender {
          _id
          username
        }
        content
        timestamp
        readBy {
          _id
        }
      }
      updatedAt
    }
  }
`;

export const MARK_THREAD_AS_READ = gql`
  mutation MarkThreadAsRead($threadId: ID!) {
    markThreadAsRead(threadId: $threadId) {
      _id
      messages {
        _id
        readBy {
          _id
        }
      }
    }
  }
`;

export const REGISTER = gql`
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
  mutation addTea(
    $name: String!
    $brand: String!
    $type: String!
    $imageUrl: String
    $tastingNotes: String
    $tags: [String]
    $favorite: Boolean
  ) {
    addTea(
      name: $name
      brand: $brand
      type: $type
      imageUrl: $imageUrl
      tastingNotes: $tastingNotes
      tags: $tags
      favorite: $favorite
    ) {
      _id
      name
      brand
      type
      imageUrl
      tastingNotes
      tags
      favorite
      rating
    }
  }
`;
export const UPDATE_TEA = gql`
  mutation Mutation(
    $teaId: ID!
    $brand: String
    $type: String
    $imageUrl: String
    $rating: Int
    $favorite: Boolean
    $name: String
  ) {
    updateTea(
      teaId: $teaId
      brand: $brand
      imageUrl: $imageUrl
      type: $type
      rating: $rating
      favorite: $favorite
      name: $name
    ) {
      name
      rating
      type
      brand
      imageUrl
      favorite
    }
  }
`;
export const GET_TEA = gql`
  query getTea($id: ID!) {
    tea(id: $id) {
      _id
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
export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      profileImageUrl
      favoriteTeas {
        _id
        name
        brand
        type
        tags
        imageUrl
        rating
        favorite
      }
    }
  }
`;
export const ADD_TEA_TO_FAVORITES = gql`
  mutation addTeaToFavorites($teaId: ID!) {
    addTeaToFavorites(teaId: $teaId) {
      _id
      username
      favoriteTeas {
        _id
        name
        brand
        type
        tags
      }
    }
  }
`;

export const SEND_FRIEND_REQUEST = gql`
  mutation SendFriendRequest($userId: ID!) {
    sendFriendRequest(userId: $userId) {
      _id
      username
    }
  }
`;

export const ACCEPT_FRIEND_REQUEST = gql`
  mutation AcceptFriendRequest($userId: ID!) {
    acceptFriendRequest(userId: $userId) {
      _id
      username
      friends { _id username }
    }
  }
`;

export const DECLINE_FRIEND_REQUEST = gql`
  mutation DeclineFriendRequest($userId: ID!) {
    declineFriendRequest(userId: $userId) {
      _id
      username
    }
  }
`;

export const REMOVE_FRIEND = gql`
  mutation RemoveFriend($userId: ID!) {
    removeFriend(userId: $userId) {
      _id
      username
    }
  }
`;

export const REMOVE_TEA_FROM_FAVORITES = gql`
  mutation removeTeaFromFavorites($teaId: ID!) {
    removeTeaFromFavorites(teaId: $teaId) {
      _id
      username
      favoriteTeas {
        _id
        name
        brand
        type
        tags
      }
    }
  }
`;
export const UPDATE_USER = gql`
  mutation updateUser($bio: String, $favoriteTeaSource: String, $profileImage: String) {
    updateUser(bio: $bio, favoriteTeaSource: $favoriteTeaSource, profileImage: $profileImage) {
      _id
      username
      email
      bio
      favoriteTeaSource
      profileImage
    }
  }
`;