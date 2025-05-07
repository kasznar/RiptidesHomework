import { GetUserReposQuery } from "../../api";
import { H2 } from "../../shared/ui-kit/Typography.tsx";
import styled from "styled-components";
import { Button } from "../../shared/ui-kit/Button.tsx";

interface RepositoryListProps {
  data?: GetUserReposQuery;
  onNext: () => void;
  onPrevious: () => void;
}

export const RepositoryList = (props: RepositoryListProps) => {
  return (
    <>
      <H2>User's repositories</H2>
      <List>
        {props.data?.user?.repositories?.nodes?.map((repo) => (
          <ListItem key={repo?.name}>
            {/* todo: check fields*/}
            <ListItemHeader>
              <Title href={repo?.url}>{repo?.name}</Title>
              <span>{repo?.description}</span>
            </ListItemHeader>
            {repo?.isFork ?? <span>forked</span>}
            {/*<span>
            Last commit date: ${repo?.defaultBranchRef?.target?.history}
          </span>*/}
            <span>Issues {repo?.issues.totalCount}</span>
            <span>Pull Requests {repo?.pullRequests.totalCount}</span>
          </ListItem>
        ))}
      </List>
      <Pagination>
        <Button
          onClick={props.onPrevious}
          disabled={!props.data?.user?.repositories.pageInfo.hasPreviousPage}
        >
          Previous
        </Button>
        <Button
          onClick={props.onNext}
          disabled={!props.data?.user?.repositories.pageInfo.hasNextPage}
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
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 20px;
`;

const Title = styled.a`
  text-decoration: none;
  color: rgb(62, 67, 78);
  font-weight: 500;
  font-size: 1.2rem;
`;
