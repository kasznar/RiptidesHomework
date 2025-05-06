import './App.css'
import {useQuery, gql} from "@apollo/client";
import {GetUserReposQuery} from "./__generated__/graphql.ts";



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

// todo: debounce
// todo: pagination
function DisplayLocations() {
    const { data, loading, error } = useQuery<GetUserReposQuery>(GET_USER_REPOS, {
        variables: { login: 'kasznar' },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    return <>
        {data?.user?.repositories.nodes?.map(repo => (
            <p key={repo?.name}>{repo?.name}</p>
        ))}
    </>
}


function App() {
  return (
    <>
        <DisplayLocations />
    </>
  )
}

export default App
