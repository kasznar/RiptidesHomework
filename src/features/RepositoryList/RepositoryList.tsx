import { ApolloError } from "@apollo/client";
import { GetUserReposQuery } from "../../api";

interface RepositoryListProps {
  loading: boolean;
  error?: ApolloError;
  data?: GetUserReposQuery;
}

export const RepositoryList = (props: RepositoryListProps) => {
  const { loading, error, data } = props;

  if (loading) return <p>Loading...</p>;
  // todo:  alma is a organization, not listed
  if (data?.user === null) return <p>No user with this username</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (data?.user?.repositories.nodes?.length === 0)
    return <p>User doesn't have any public repositories yet.</p>;

  return (
    <>
      {data?.user?.repositories.nodes?.map((repo) => (
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
