import { gql, useQuery } from "@apollo/client";
import { Input } from "../../shared/ui-kit/Input.tsx";
import { useEffect, useState } from "react";
import { URLParams } from "../../shared/URLParams.ts";
import { useDebounce } from "../../shared/useDebounce.ts";
import { RepositoryList } from "./RepositoryList.tsx";
import { H1, H2 } from "../../shared/ui-kit/Typography.tsx";
import styled from "styled-components";
import { Screen } from "../../shared/ui-kit/Screen.tsx";
import { ContributionChart } from "./ContributionChart.tsx";
import { GetUserContributionsQuery } from "../../api";

const GET_USER_CONTRIBUTIONS = gql`
  query GetUserContributions($login: String!) {
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

  const query = useQuery<GetUserContributionsQuery>(GET_USER_CONTRIBUTIONS, {
    variables: { login: debouncedUser },
    skip: !debouncedUser,
    errorPolicy: "all",
  });

  const renderContent = () => {
    if (!user) return <H2>Search for a user</H2>;
    if (query.loading) return <H2>Loading...</H2>;
    if (query.data?.user === null) return <H2>No user with this username</H2>;
    if (query.error) return <H2>Something went wrong</H2>;
    if (!query.data || !query.data.user) return null;

    const weeks =
      query.data.user.contributionsCollection.contributionCalendar.weeks;

    return (
      <>
        <ContributionChart data={weeks} username={user} />
        <RepositoryList username={debouncedUser} />
      </>
    );
  };

  return (
    <Screen>
      <Header>
        <Title>GitHub Repositories & Contributions</Title>
        <Input value={user} onChange={setUser} placeholder="Enter username" />
      </Header>
      {renderContent()}
    </Screen>
  );
};

const Title = styled(H1)`
  margin: 0;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 20px 0;
  gap: 10px;

  @media (min-width: 992px) {
    flex-direction: row;
  }
`;
