import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";

// Create an HTTP link to your GraphQL endpoint.
const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
    credentials: "include",
});

// Create a middleware link to set the Authorization header on each request.
const authLink = setContext((_, { headers }) => {
    // Get the authentication token from local storage if it exists.
    const token = localStorage.getItem('userToken');
    // Return the headers to the context so httpLink can read them.
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Create a link to handle errors globally, especially for authentication.
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            // Check for a specific error code or message from your backend.
            // This is a common pattern for expired/invalid tokens.
            if (err.message.includes('Unauthenticated')) {
                // The AuthContext will handle the logout and redirect.
                // We just log it here for debugging purposes.
                console.error("GraphQL Unauthenticated error:", err.message);
            }
        }
    }
});

// Create the Apollo Client instance.
const client = new ApolloClient({
    // Chain the links together. The error link should come before the http link.
    link: errorLink.concat(authLink.concat(httpLink)),
    // Use an in-memory cache for storing query results.
    cache: new InMemoryCache(),
});

export default client;