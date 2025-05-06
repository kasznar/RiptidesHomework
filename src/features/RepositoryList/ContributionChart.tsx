import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";
import { GetUserReposQuery } from "../../api";
import { H2 } from "../../shared/ui-kit/Typography.tsx";

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
      <StyledChartContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis
            dataKey="weekStart"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

          {/*<Tooltip />*/}
          <Bar dataKey="totalContributions" fill="#9176ef" />
        </BarChart>
      </StyledChartContainer>
    </Container>
  );
};

const StyledChartContainer = styled(ResponsiveContainer)`
  width: 100%;
  height: 300px;
  margin-left: -30px;
`;

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
