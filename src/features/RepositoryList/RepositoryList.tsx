import { GetUserReposQuery } from "../../api";
import { H2 } from "../../shared/ui-kit/Typography.tsx";
import styled from "styled-components";

interface RepositoryListProps {
  data?: GetUserReposQuery;
}

export const RepositoryList = (props: RepositoryListProps) => {
  return (
    <>
      <H2>User's repositories</H2>
      <List>
        {props.data?.user?.repositories?.nodes?.map((repo) => (
          <ListItem key={repo?.name}>
            <ListItemHeader>
              <a href={repo?.url}>Name: {repo?.name}</a>
              <span>{repo?.description}</span>
            </ListItemHeader>
            {repo?.isFork ?? <span>forked</span>}
            {/*<span>
            Last commit date: ${repo?.defaultBranchRef?.target?.history}
          </span>*/}
            <span>Issues ${repo?.issues.totalCount}</span>
            <span>Pull Requests ${repo?.pullRequests.totalCount}</span>
          </ListItem>
        ))}
      </List>
    </>
  );
};

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
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
`;
