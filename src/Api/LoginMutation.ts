import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    authenticate(authenticateRequest: { email: $email, password: $password }) {
      jwtToken
      refreshToken
    }
  }
`;
