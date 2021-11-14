import { FC, useContext, useMemo } from "react";
import { RouteComponentProps } from "@reach/router";
import { gql, useQuery } from "@apollo/client";
import { AuthContext, AuthDataType } from "../../App";

const GET_USER_QUERY = gql`
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

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const HomeDemo: FC<RouteComponentProps & { authData: AuthDataType }> = ({
  path,
}) => {
  var userId = useMemo(
    () => parseJwt(localStorage.getItem("jwtToken") ?? "").unique_name,
    []
  );

  var { data, loading, error } = useQuery(GET_USER_QUERY, {
    variables: { userId: parseInt(userId) },
  });

  const user = useMemo(() => data?.users?.[0], [data]);
  console.log(data);

  return (
    <>
      {!loading && !error ? (
        <>
          <div>You've logged in as:</div>
          <div>UserId: {userId}</div>
          <div>User Email: {user.email}</div>
          <div>User first name: {user.firstName}</div>
          <div>User last name: {userId.lastName}</div>
          <div>User jwtToken {localStorage.getItem("jwtToken") ?? "null"}</div>
        </>
      ) : (
        <>Error</>
      )}
    </>
  );
};
