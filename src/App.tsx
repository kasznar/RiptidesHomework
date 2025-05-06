import './App.css'
import {useQuery, gql} from "@apollo/client";
// import {gql} from "./__generated__/gql";


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


function DisplayLocations() {
    const { data, loading, error } = useQuery(GET_USER_REPOS, {
        variables: { login: 'kasznar' },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    return <pre>{JSON.stringify(data, null, 4)}</pre>
}


function App() {
  return (
    <>
        <DisplayLocations />
    </>
  )
}

export default App
