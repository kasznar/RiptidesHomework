import { useEffect, useLayoutEffect, useRef } from "react";
import * as d3 from "d3";
import styled from "styled-components";

interface Breakdown {
  commits: number;
  issues: number;
  pullRequests: number;
  pullRequestReviews: number;
}

export interface WeeklyContributions {
  weekStart: string;
  weekStartDate?: Date;
  weekEnd: string;
  weekEndDate?: Date;
  totalContributions: number;
}

interface BarChartProps {
  data: WeeklyContributions[];
  getBreakDown: (
    weeklyContributions: WeeklyContributions,
  ) => Promise<Breakdown>;
}

interface Vector {
  x: number;
  y: number;
}

const drawChart = (
  svgRef: SVGSVGElement,
  data: WeeklyContributions[],
  dimensions: Vector,
  getBreakDown: (
    weeklyContributions: WeeklyContributions,
  ) => Promise<Breakdown>,
) => {
  d3.select(svgRef).selectAll("*").remove();

  const width = dimensions.x;
  const height = dimensions.y;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const barWidth = innerWidth / data.length;

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.weekStartDate) as [Date, Date])
    .range([0, innerWidth]);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((i) => i.totalContributions)) as number])
    .range([innerHeight, 0]);

  const svg = d3.select(svgRef).attr("viewBox", [0, 0, width, height]);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  let timeoutId: NodeJS.Timeout;

  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.weekStartDate!) ?? null)
    .attr("y", (d) => y(d.totalContributions))
    .attr("width", barWidth)
    .attr("height", (d) => innerHeight - y(d.totalContributions))
    .attr("fill", "steelblue")
    .attr("cursor", "pointer")
    .on("click", (event, d) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(async () => {
        d3.selectAll(".bar").style("opacity", "1");
        d3.selectAll(".stack").remove();

        const breakdown = await getBreakDown(d);

        const series: Array<{ key: string; value: [number, number] }> = [];

        let last = 0;

        for (const breakdownKey in breakdown) {
          // @ts-expect-error key type
          const count = breakdown[breakdownKey];
          const top = count + last;

          series.push({ key: breakdownKey, value: [last, top] });

          last = top;
        }

        d3.select(event.target).style("opacity", "0");

        const color = {
          commits: "#fffe78",
          issues: "#ff9d42",
          pullRequests: "#52ff52",
          pullRequestReviews: "#d34f8c",
        };

        g.selectAll(".stack")
          .data(series)
          .enter()
          .append("rect")
          .attr("class", "stack")
          .attr("x", x(d.weekStartDate!) ?? null)
          // @ts-expect-error key type
          .attr("fill", (dd) => color[dd.key])
          .attr("y", (dd) => y(dd.value[1]))
          .attr("height", (dd) => y(dd.value[0]) - y(dd.value[1]))
          .attr("width", barWidth)
          .on("mouseleave", () => {
            d3.selectAll(".stack").remove();
            d3.select(event.target).style("opacity", "1");
          });
      }, 100);
    })
    .on("mouseleave", () => {
      d3.selectAll(".bar").style("opacity", "1");
      // d3.select(event.target).style("opacity", "1");
    });

  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(d3.timeMonth.every(1))
        // @ts-expect-error d3 type error
        .tickFormat(d3.timeFormat("%b")), // short month names
      0,
    );

  g.append("g").call(d3.axisLeft(y));
};

export function BarChart(props: BarChartProps) {
  const data = props.data.map((d) => ({
    ...d,
    weekStartDate: new Date(d.weekStart),
    weekEndDate: new Date(d.weekEnd),
  }));

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!svgRef.current) return;
      if (!containerRef.current) return;
      drawChart(
        svgRef.current!,
        data,
        {
          x: containerRef.current?.clientWidth ?? 0,
          y: containerRef.current?.clientHeight ?? 0,
        },
        props.getBreakDown,
      );
    });
  }, []);

  useLayoutEffect(() => {
    function updateSize() {
      drawChart(
        svgRef.current!,
        data,
        {
          x: containerRef.current?.clientWidth ?? 0,
          y: containerRef.current?.clientHeight ?? 0,
        },
        props.getBreakDown,
      );
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <ChartContainer ref={containerRef}>
      <svg ref={svgRef}></svg>
    </ChartContainer>
  );
}

const ChartContainer = styled.div`
  height: 300px;
  padding-right: 30px;
`;
