import {gql} from "@apollo/client";

export const REVOKE_TOKEN_MUTATION = gql`
mutation RevokeToken($refreshToken:String!)
{
revokeToken(refreshToken:$refreshToken)
}
`;