import { GetUserReposQuery } from "../../api";
import { H2 } from "../../shared/ui-kit/Typography.tsx";
import styled from "styled-components";
import { Button } from "../../shared/ui-kit/Button.tsx";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { DateUtils } from "../../shared/dateUtils.ts";

const GET_USER_REPOS = gql`
  query GetUserRepos(
    $login: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    user(login: $login) {
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

type Repository = NonNullable<
  NonNullable<NonNullable<GetUserReposQuery["user"]>["repositories"]>["nodes"]
>[number];

interface RepositoryListProps {
  username: string;
}

enum PaginationDirection {
  Forward = "forward",
  Backward = "backward",
}

const getLastCommitDate = (repo: Repository) => {
  const date =
    repo?.defaultBranchRef?.target?.__typename === "Commit"
      ? repo.defaultBranchRef.target.history.edges?.[0]?.node?.committedDate
      : null;

  return DateUtils.formatDate(date);
};

export const RepositoryList = (props: RepositoryListProps) => {
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
    variables: { login: props.username, ...paginationVariables },
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

  if (query.data?.user?.repositories.nodes?.length === 0)
    return <H2>User doesn't have any public repositories yet.</H2>;

  return (
    <>
      <H2>User's repositories</H2>
      {query.loading ? (
        <H2>Loading...</H2>
      ) : (
        <List>
          {query.data?.user?.repositories?.nodes?.map((repo) => (
            <ListItem key={repo?.name}>
              <ListItemHeader>
                <Title href={repo?.url}>{repo?.name}</Title>
                <span>{repo?.description}</span>
              </ListItemHeader>
              {repo?.isFork ?? <span>forked</span>}
              <span>Last commit {getLastCommitDate(repo)}</span>
              <span>Issues {repo?.issues.totalCount}</span>
              <span>Pull Requests {repo?.pullRequests.totalCount}</span>
            </ListItem>
          ))}
        </List>
      )}
      <Pagination>
        <Button
          onClick={handlePreviousPage}
          disabled={!query.data?.user?.repositories.pageInfo.hasPreviousPage}
        >
          Previous
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={!query.data?.user?.repositories.pageInfo.hasNextPage}
        >
          Next
        </Button>
      </Pagination>
    </>
  );
};

const Pagination = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  justify-content: center;
`;

const ListItem = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const ListItemHeader = styled.div`
  flex-grow: 1;
  flex-direction: column;
  display: flex;
  margin-bottom: 10px;
`;

const List = styled.div`
  display: grid;
  grid-gap: 20px;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const Title = styled.a`
  text-decoration: none;
  color: rgb(62, 67, 78);
  font-weight: 500;
  font-size: 1.2rem;
`;
