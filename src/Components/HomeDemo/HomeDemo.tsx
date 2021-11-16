import { FC, useMemo } from "react";
import { RouteComponentProps } from "@reach/router";
import { useMutation, useQuery } from "@apollo/client";
import { navigate } from "../../Navigation/navigate";
import { GET_USER_QUERY } from "../../Api/GetUserQuery";
import { Button } from "rsuite";
import { REVOKE_TOKEN_MUTATION } from "../../Api/RevokeTokenMutation";

function parseJwt(token: string | null) {
  if (!token) {
    navigate.toAuth().then(() => window.location.reload());
    return;
  }

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

export const HomeDemo: FC<RouteComponentProps> = () => {
  var userId = useMemo(
    () => parseJwt(localStorage.getItem("jwtToken"))?.unique_name,
    []
  );

  var { data, loading, error } = useQuery(GET_USER_QUERY, {
    variables: { userId: parseInt(userId) },
  });

  var [revokeToken] = useMutation(REVOKE_TOKEN_MUTATION, {
    variables: { refreshToken: localStorage.getItem("refreshToken") ?? "" },
  });

  const user = useMemo(() => data?.users?.[0], [data]);

  if (!user) {
    console.error("Somehow user wasn't found");
    return <div></div>;
  }

  return (
    <>
      {!loading && !error && user ? (
        <>
          <div>You've logged in as:</div>
          <div>UserId: {userId}</div>
          <div>User Email: {user.email}</div>
          <div>User first name: {user.firstName}</div>
          <div>User last name: {userId.lastName}</div>
          <div>User jwtToken {localStorage.getItem("jwtToken") ?? "null"}</div>
          <div>User refreshToken {localStorage.getItem("refreshToken") ?? "null"}</div>

          <Button
            onClick={() => {
              revokeToken().then(() => {
                localStorage.removeItem("jwtToken");
                localStorage.removeItem("refreshToken");
                navigate.toAuth();
              })
                  .catch(()=>navigate.toAuth());
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <>Error</>
      )}
    </>
  );
};
