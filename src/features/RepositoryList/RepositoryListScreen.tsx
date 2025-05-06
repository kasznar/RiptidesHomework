import { gql, useQuery } from "@apollo/client";
import { GetUserReposQuery } from "../../api";
import { Input } from "../../shared/ui-kit/Input.tsx";
import { ContributionChart } from "./ContributionChart.tsx";
import { useEffect, useState } from "react";
import { URLParams } from "../../shared/URLParams.ts";
import { useDebounce } from "../../shared/useDebounce.ts";
import { RepositoryList } from "./RepositoryList.tsx";

const GET_USER_REPOS = gql`
  query GetUserRepos($login: String!) {
    user(login: $login) {
      repositories(
        first: 10
        orderBy: { field: UPDATED_AT, direction: DESC }
        ownerAffiliations: [OWNER]
      ) {
        nodes {
          name
          description
          url
          isFork
          updatedAt
          stargazerCount
          issues {
            totalCount
          }
          pullRequests {
            totalCount
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) {
                  edges {
                    node {
                      committedDate
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

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

export const RepositoryListScreen = () => {
  const [user, setUser] = useSearchPhrase();

  const query = useQuery<GetUserReposQuery>(GET_USER_REPOS, {
    variables: { login: user },
    skip: !user,
    errorPolicy: "all",
  });

  return (
    <>
      <Input value={user} onChange={setUser} />
      <ContributionChart />
      <RepositoryList {...query} />
    </>
  );
};
