import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export * from "./__generated__";
export * from "./__generated__/graphql.ts";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.github.com/graphql",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
    },
  }),
  cache: new InMemoryCache(),
});
