import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { ApolloLink, fromPromise } from "apollo-link";
import { setContext } from "@apollo/client/link/context";
import { onError } from "apollo-link-error";
import { REFRESH_TOKEN_MUTATION } from "./Api/RefreshTokenMutation";
import { navigate } from "./Navigation/navigate";

let client: ApolloClient<NormalizedCacheObject>;

const getNewToken = () => {
  return client
    .mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken: localStorage.getItem("refreshToken") },
    })
    .then((response) => {
      if (response.errors) navigate.toAuth();
      const { jwtToken, refreshToken } = response.data.refreshToken;

      localStorage.setItem("jwtToken", jwtToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { jwtToken, refreshToken };
    });
};

const httpLink = createHttpLink({
  uri: "https://localhost:5001/graphql/",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("jwtToken");
  console.log("Token", token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions?.code) {
          case "AUTH_NOT_AUTHENTICATED":
            return fromPromise(
              getNewToken().catch((error) => {
                // Handle token refresh errors e.g clear stored tokens, redirect to login
                navigate.toAuth();
                return;
              })
            )
              .filter((value) => Boolean(value))
              .flatMap((tokens) => {
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${tokens?.jwtToken}`,
                  },
                });

                return forward(operation);
              });
          case "CapstoneProject.Model.Exceptions.RefreshTokenException":
            navigate.toAuth();
        }
      }
    }
  }
);

client = new ApolloClient({
  // @ts-ignore
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export { client as apolloClient };
