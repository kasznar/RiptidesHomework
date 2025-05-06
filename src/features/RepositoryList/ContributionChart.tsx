import styled from "styled-components";
import {
  client,
  GetUserContributionsQuery,
  GetUserContributionsQueryVariables,
  GetUserReposQuery,
} from "../../api";
import { H2 } from "../../shared/ui-kit/Typography.tsx";
import { BarChart, WeeklyContributions } from "./BarChart.tsx";

import { gql } from "@apollo/client";

const GET_USER_CONTRIBUTIONS = gql`
  query GetUserContributions(
    $username: String!
    $from: DateTime!
    $to: DateTime!
  ) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        issueContributions {
          totalCount
        }
        pullRequestContributions {
          totalCount
        }
        pullRequestReviewContributions {
          totalCount
        }
      }
    }
  }
`;

type Week = NonNullable<
  NonNullable<
    GetUserReposQuery["user"]
  >["contributionsCollection"]["contributionCalendar"]["weeks"]
>[number];

interface ContributionChartProps {
  data: Week[];
  username: string;
}

const sumWeeklyData = (weeks: Week[]): WeeklyContributions[] => {
  return weeks.map((week) => {
    const total = week.contributionDays.reduce(
      (sum, day) => sum + day.contributionCount,
      0,
    );

    return {
      weekStart: week.contributionDays[0].date,
      weekEnd: week.contributionDays[week.contributionDays.length - 1].date,
      totalContributions: total,
    };
  });
};

const sumYearlyData = (contributions: WeeklyContributions[]) =>
  contributions.reduce(
    (accumulator, current) => accumulator + current.totalContributions,
    0,
  );

export const ContributionChart = (props: ContributionChartProps) => {
  const data = sumWeeklyData(props.data);
  const yearlySum = sumYearlyData(data);

  const fetchBreakdown = async (weeklyContributions: WeeklyContributions) => {
    const toEndOfDay = new Date(weeklyContributions.weekEnd);
    toEndOfDay.setUTCHours(23, 59, 59, 999);

    const result = await client.query<
      GetUserContributionsQuery,
      GetUserContributionsQueryVariables
    >({
      query: GET_USER_CONTRIBUTIONS,
      variables: {
        from: weeklyContributions.weekStartDate,
        to: toEndOfDay,
        username: props.username,
      },
    });

    const contributionsCollection = result.data.user?.contributionsCollection;

    const issues = contributionsCollection?.issueContributions.totalCount ?? 0;
    const pullRequests =
      contributionsCollection?.pullRequestContributions.totalCount ?? 0;
    const pullRequestReviews =
      contributionsCollection?.pullRequestReviewContributions.totalCount ?? 0;
    const commits =
      weeklyContributions.totalContributions -
      pullRequests -
      pullRequestReviews -
      issues;

    return {
      commits,
      issues,
      pullRequests,
      pullRequestReviews,
    };
  };

  return (
    <Container>
      {yearlySum === 0 ? (
        <Title>
          This doesn't have any public contributions for the past year
        </Title>
      ) : (
        <>
          <Title>Contributions in the last year</Title>

          <BarChart data={data} getBreakDown={fetchBreakdown} />
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  background-color: #130f25;
  padding-top: 64px;
  padding-left: 48px;
  padding-right: 48px;
  padding-bottom: 60px;
`;

const Title = styled(H2)`
  color: white;
`;
