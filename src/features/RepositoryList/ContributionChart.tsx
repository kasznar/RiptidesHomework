import styled from "styled-components";
import { GetUserReposQuery } from "../../api";
import { H2 } from "../../shared/ui-kit/Typography.tsx";
import { BarChart } from "./BarChart.tsx";

interface ContributionChartProps {
  data?: GetUserReposQuery;
}

type Week = NonNullable<
  NonNullable<
    GetUserReposQuery["user"]
  >["contributionsCollection"]["contributionCalendar"]["weeks"]
>[number];

const transformWeeklyData = (weeks: Week[]) => {
  return weeks.map((week) => {
    const total = week.contributionDays.reduce(
      (sum, day) => sum + day.contributionCount,
      0,
    );
    return {
      weekStart: week.contributionDays[0].date,
      totalContributions: total,
    };
  });
};

export const ContributionChart = (props: ContributionChartProps) => {
  if (!props.data?.user?.contributionsCollection.contributionCalendar.weeks)
    return null;

  const data = transformWeeklyData(
    props.data?.user?.contributionsCollection.contributionCalendar.weeks,
  );

  return (
    <Container>
      <Title>Contributions in the last year</Title>
      <BarChart
        data={data}
        getBreakDown={() => ({
          commits: 1,
          issues: 1,
          pullRequests: 2,
          pullRequestReviews: 1,
        })}
      />
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
