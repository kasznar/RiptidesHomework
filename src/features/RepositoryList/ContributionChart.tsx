import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";
import { GetUserReposQuery } from "../../api";

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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis
            dataKey="weekStart"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalContributions" fill="#3f51b5" />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 500px;
  height: 500px;
`;
