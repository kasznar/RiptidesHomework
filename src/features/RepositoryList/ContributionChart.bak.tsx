import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import styled from "styled-components";
import { GetUserReposQuery } from "../../api";
import { H2 } from "../../shared/ui-kit/Typography.tsx";
import { useEffect, useState } from "react";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  useEffect(() => {
    console.log("activeIndex", activeIndex);
  }, [activeIndex]);

  if (!props.data?.user?.contributionsCollection.contributionCalendar.weeks)
    return null;

  const data = transformWeeklyData(
    props.data?.user?.contributionsCollection.contributionCalendar.weeks,
  );

  /*
  const renderBars = () => {
    return data.map((_, index) => {
      if (showDetails === index) {
        return (
          <>
            <Bar dataKey="commits" stackId="a" fill="#4CAF50" />
            <Bar dataKey="issues" stackId="a" fill="#FF9800" />
            <Bar dataKey="pullRequests" stackId="a" fill="#2196F3" />
            <Bar dataKey="reviews" stackId="a" fill="#9C27B0" />
          </>
        );
      } else {
        return (
          <Bar
            onMouseEnter={() => {
              console.log("enter", index);

              setShowDetails(index);
            }}
            dataKey="totalContributions"
            fill="#9176ef"
          />
        );
      }
    });
  };
    */

  return (
    <Container>
      <Title>Contributions in the last year</Title>
      <StyledChartContainer width="100%" height={300}>
        <BarChart
          data={data}
          /*onMouseMove={(state) => {
            if (state.isTooltipActive) {
              setActiveIndex(state.activeTooltipIndex);
              setMouseLeave(false);
            } else {
              setActiveIndex(undefined);
              setMouseLeave(true);
            }
          }}*/
        >
          <XAxis
            dataKey="weekStart"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />

          {/*<Tooltip cursor={false} />*/}

          {/*<Bar
            dataKey="totalContributions"
            fill="#9176ef"
            activeBar={() => (
              <>
                <div>hello</div>
                <Bar dataKey="commits" stackId="a" fill="#4CAF50" />
                <Bar dataKey="issues" stackId="a" fill="#FF9800" />
                <Bar dataKey="pullRequests" stackId="a" fill="#2196F3" />
                <Bar dataKey="reviews" stackId="a" fill="#9C27B0" />
              </>
            )}
          />*/}

          {/*<Bar>
            <>{renderBars()}</>
          </Bar>*/}

          {/*<Bar dataKey="totalContributions" fill="#9176ef">
            {data.map((_, index) => (
              <Cell
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                cursor="pointer"
                fill={index === activeIndex ? "#fffe78" : "#9176ef"}
                key={`cell-${index}`}
              />
            ))}
          </Bar>*/}
          <Bar dataKey="totalContributions">
            {data.map((_, index) => {
              if (index === activeIndex) {
                return (
                  <>
                    <Cell
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      cursor="pointer"
                      fill={index === activeIndex ? "#fffe78" : "#9176ef"}
                      key={`cell-${index}`}
                    />
                    <Cell
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      cursor="pointer"
                      fill={index === activeIndex ? "#fffe78" : "#9176ef"}
                      key={`cell-${index}`}
                    />
                  </>
                );
              }

              return (
                <Cell
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  cursor="pointer"
                  fill={index === activeIndex ? "#fffe78" : "#9176ef"}
                  key={`cell-${index}`}
                />
              );
            })}
          </Bar>
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
