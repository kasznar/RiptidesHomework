import { gql, useQuery } from "@apollo/client";
import { GetUserReposQuery } from "../../api";
import { Input } from "../../shared/ui-kit/Input.tsx";
import { useEffect, useState } from "react";
import { URLParams } from "../../shared/URLParams.ts";
import { useDebounce } from "../../shared/useDebounce.ts";
import { RepositoryList } from "./RepositoryList.tsx";
import { H1, H2 } from "../../shared/ui-kit/Typography.tsx";
import styled from "styled-components";
import { Screen } from "../../shared/ui-kit/Screen.tsx";
import { ContributionChart } from "./ContributionChart.tsx";

const GET_USER_REPOS = gql`
  query GetUserRepos(
    $login: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
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
        first: $first
        after: $after
        last: $last
        before: $before
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
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
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

enum PaginationDirection {
  Forward = "forward",
  Backward = "backward",
}

export const RepositoryListScreen = () => {
  const [user, debouncedUser, setUser] = useSearchPhrase();

  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [beforeCursor, setBeforeCursor] = useState<string | null>(null);
  const [paginationDirection, setPaginationDirection] =
    useState<PaginationDirection>(PaginationDirection.Forward);

  const pageSize = 10;

  const paginationVariables =
    paginationDirection === PaginationDirection.Forward
      ? { first: pageSize, after: afterCursor, last: null, before: null }
      : { first: null, after: null, last: pageSize, before: beforeCursor };

  const query = useQuery<GetUserReposQuery>(GET_USER_REPOS, {
    variables: { login: debouncedUser, ...paginationVariables },
    skip: !debouncedUser,
    errorPolicy: "all",
  });

  const handleNextPage = () => {
    if (
      query.data?.user?.repositories.pageInfo.hasNextPage &&
      query.data?.user.repositories.pageInfo.endCursor
    ) {
      setBeforeCursor(null);
      setAfterCursor(query.data.user.repositories.pageInfo.endCursor);
      setPaginationDirection(PaginationDirection.Forward);
    }
  };

  const handlePreviousPage = () => {
    if (
      query.data?.user?.repositories.pageInfo.hasPreviousPage &&
      query.data?.user.repositories.pageInfo.startCursor
    ) {
      setAfterCursor(null);
      setBeforeCursor(query.data.user.repositories.pageInfo.startCursor);
      setPaginationDirection(PaginationDirection.Backward);
    }
  };

  const renderContent = () => {
    if (!user) return <H2>Search for a user</H2>;
    if (query.loading) return <H2>Loading...</H2>;
    if (query.error) return <H2>Something went wrong</H2>;
    if (query.data?.user === null) return <H2>No user with this username</H2>;
    if (query.data?.user?.repositories.nodes?.length === 0)
      return <H2>User doesn't have any public repositories yet.</H2>;
    if (!query.data || !query.data.user) return null;

    const weeks =
      query.data.user.contributionsCollection.contributionCalendar.weeks;

    return (
      <>
        <ContributionChart data={weeks} username={user} />
        <RepositoryList
          onNext={handleNextPage}
          onPrevious={handlePreviousPage}
          {...query}
        />
      </>
    );
  };

  return (
    <Screen>
      <Header>
        <H1>GitHub Repositories & Contributions</H1>
        <Input value={user} onChange={setUser} placeholder="Enter username" />
      </Header>
      {renderContent()}
    </Screen>
  );
};

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
