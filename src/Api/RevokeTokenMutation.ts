import { gql } from "@apollo/client";

export const RevokeOperationName = "RevokeToken";

export const REVOKE_TOKEN_MUTATION = gql`
  mutation ${RevokeOperationName}($refreshToken: String!) {
    revokeToken(refreshToken: $refreshToken)
  }
`;
