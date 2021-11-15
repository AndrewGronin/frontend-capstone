import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation RegisterMutation(
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    register(
      inputUser: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      id
    }
  }
`;
