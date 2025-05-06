import { useQuery, gql, ApolloError } from "@apollo/client";
import { GetUserReposQuery } from "../../__generated__/graphql.ts";
import { useState } from "react";
import { Input } from "../../shared/ui-kit/Input.tsx";

const GET_USER_REPOS = gql`
  query GetUserRepos($login: String!) {
    user(login: $login) {
      repositories(first: 10, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          name
          description
          url
          updatedAt
          stargazerCount
        }
      }
    }
  }
`;

interface RepositoryListProps {
  loading: boolean;
  error?: ApolloError;
  data?: GetUserReposQuery;
}

const RepositoryList = (props: RepositoryListProps) => {
  const { loading, error, data } = props;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <>
      {data?.user?.repositories.nodes?.map((repo) => (
        <p key={repo?.name}>{repo?.name}</p>
      ))}
    </>
  );
};

// todo: debounce
// todo: pagination
export const ListUserRepositories = () => {
  const [user, setUser] = useState("");

  const query = useQuery<GetUserReposQuery>(GET_USER_REPOS, {
    variables: { login: user },
    skip: !user,
  });

  return (
    <>
      <Input value={user} onChange={setUser} />
      <RepositoryList {...query} />
    </>
  );
};
