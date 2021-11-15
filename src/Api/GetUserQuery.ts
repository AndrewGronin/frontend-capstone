import { gql } from "@apollo/client";

export const GET_USER_QUERY = gql`
  query UserQuery($userId: Int!) {
    users(ids: [$userId]) {
      firstName
      lastName
      passwordHash
      id
      email
    }
  }
`;
