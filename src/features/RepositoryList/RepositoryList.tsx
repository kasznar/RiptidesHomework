import { GetUserReposQuery } from "../../api";

interface RepositoryListProps {
  data?: GetUserReposQuery;
}

export const RepositoryList = (props: RepositoryListProps) => {
  return (
    <>
      {props.data?.user?.repositories?.nodes?.map((repo) => (
        <div key={repo?.name}>
          <a href={repo?.url}>Name: {repo?.name}</a>
          <span>Desc: {repo?.description}</span>
          <span>Forked?: {String(repo?.isFork)}</span>
          {/*<span>
            Last commit date: ${repo?.defaultBranchRef?.target?.history}
          </span>*/}
          <span>Issue Count: ${repo?.issues.totalCount}</span>
          <span>Pull Request count: ${repo?.pullRequests.totalCount}</span>
        </div>
      ))}
    </>
  );
};
