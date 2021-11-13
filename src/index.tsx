import React from 'react';
import ReactDOM, {render} from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
    ApolloClient,
    ApolloProvider, createHttpLink,
    gql,
    InMemoryCache,
    NormalizedCacheObject
} from "@apollo/client";

import "rsuite/dist/rsuite.min.css";
import {setContext} from "@apollo/client/link/context";
import {useToggleKeyDownEvent} from "rsuite/Picker";
import {onError} from "apollo-link-error";
import {fromPromise, ApolloLink } from "apollo-link";

const REFRESH_TOKEN_MUTATION = gql`
mutation RefreshToken($refreshToken:String!)
{
    refreshToken(refreshToken:$refreshToken)
{
  jwtToken
  refreshToken
}

}

`

let client: ApolloClient<NormalizedCacheObject>;

const getNewToken = () => {
    return client
        .mutate({ mutation: REFRESH_TOKEN_MUTATION, variables:{refreshToken:localStorage.getItem("refreshToken")} })
        .then((response) => {

        const { jwtToken, refreshToken } = response.data.refreshToken;

        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("refreshToken", refreshToken);

        return { jwtToken, refreshToken };
    });
};

const httpLink = createHttpLink({
    uri: 'https://localhost:5001/graphql/',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('jwtToken');
    console.log("Token", token)
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
            for (let err of graphQLErrors) {
                switch (err.extensions.code) {
                    case "AUTH_NOT_AUTHENTICATED":
                        return fromPromise(
                            getNewToken().catch((error) => {
                                // Handle token refresh errors e.g clear stored tokens, redirect to login
                                return;
                            })
                        )
                            .filter((value) => Boolean(value))
                            .flatMap((tokens) => {
                                const oldHeaders = operation.getContext().headers;
                                // modify the operation context with a new token
                                operation.setContext({
                                    headers: {
                                        ...oldHeaders,
                                        authorization: `Bearer ${tokens?.jwtToken}`,
                                    },
                                });

                                // retry the request, returning the new observable
                                return forward(operation);
                            });
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

render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
