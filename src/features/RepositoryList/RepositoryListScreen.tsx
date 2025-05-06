import { gql, useQuery } from "@apollo/client";
import { GetUserReposQuery } from "../../api";
import { Input } from "../../shared/ui-kit/Input.tsx";
import { ContributionChart } from "./ContributionChart.tsx";
import { useEffect, useState } from "react";
import { URLParams } from "../../shared/URLParams.ts";
import { useDebounce } from "../../shared/useDebounce.ts";
import { RepositoryList } from "./RepositoryList.tsx";
import { fontH1, H1 } from "../../shared/ui-kit/Typography.tsx";
import styled from "styled-components";
import { Screen } from "../../shared/ui-kit/Screen.tsx";

const GET_USER_REPOS = gql`
  query GetUserRepos($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      repositories(
        first: 10
        orderBy: { field: UPDATED_AT, direction: DESC }
        ownerAffiliations: [OWNER]
      ) {
        nodes {
          id
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

const useSearchPhrase = (): [string, string, (newValue: string) => void] => {
  const [user, setUser] = useState(() => URLParams.get(URL_PARAM_USER) ?? "");
  const debouncedUser = useDebounce(user);

  useEffect(() => {
    if (debouncedUser) {
      URLParams.set(URL_PARAM_USER, debouncedUser);
    } else {
      URLParams.delete(URL_PARAM_USER);
    }
  }, [debouncedUser]);

  return [user, debouncedUser, setUser];
};

export const RepositoryListScreen = () => {
  const [user, debouncedUser, setUser] = useSearchPhrase();

  const query = useQuery<GetUserReposQuery>(GET_USER_REPOS, {
    variables: { login: debouncedUser },
    skip: !debouncedUser,
    errorPolicy: "all",
  });

  /*
  if (query.loading) return <p>Loading...</p>;
  // todo:  alma is a organization, not listed
  if (query.data?.user === null) return <p>No user with this username</p>;
  if (query.error) return <p>Error : {query.error.message}</p>;
  if (query.data?.user?.repositories.nodes?.length === 0)
    return <p>User doesn't have any public repositories yet.</p>;
   */

  return (
    <Screen>
      <Header>
        <H1>GitHub Repositories & Contributions</H1>
        <SearchTitle>Search</SearchTitle>
        <Input value={user} onChange={setUser} />
      </Header>
      <ContributionChart {...query} />
      <RepositoryList {...query} />
    </Screen>
  );
};

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SearchTitle = styled.span`
  ${fontH1};
  flex-grow: 1;
  text-align: end;
  padding: 10px;
`;
