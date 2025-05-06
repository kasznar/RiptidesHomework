import { useQuery, gql, ApolloError } from "@apollo/client";
import { GetUserReposQuery } from "../../api";
import { useEffect, useState } from "react";
import { Input } from "../../shared/ui-kit/Input.tsx";
import { useDebounce } from "../../shared/useDebounce.ts";
import { URLParams } from "../../shared/URLParams.ts";

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
  // todo: check alma
  if (data?.user === null) return <p>No user with this username</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (data?.user?.repositories.nodes?.length === 0)
    return <p>User doesn't have any public repositories yet.</p>;

  return (
    <>
      {data?.user?.repositories.nodes?.map((repo) => (
        <p key={repo?.name}>{repo?.name}</p>
      ))}
    </>
  );
};

const URL_PARAM_USER = "user";

const useSearchPhrase = (): [string, (newValue: string) => void] => {
  const [user, setUser] = useState(() => URLParams.get(URL_PARAM_USER) ?? "");
  const debouncedUser = useDebounce(user);

  useEffect(() => {
    if (debouncedUser) {
      URLParams.set(URL_PARAM_USER, debouncedUser);
    } else {
      URLParams.delete(URL_PARAM_USER);
    }
  }, [debouncedUser]);

  return [user, setUser];
};

// todo: pagination
export const ListUserRepositories = () => {
  const [user, setUser] = useSearchPhrase();

  const query = useQuery<GetUserReposQuery>(GET_USER_REPOS, {
    variables: { login: user },
    skip: !user,
    errorPolicy: "all",
  });

  return (
    <>
      <Input value={user} onChange={setUser} />
      <RepositoryList {...query} />
    </>
  );
};
