import { useEffect, useRef } from "react";
import * as d3 from "d3";

/*(Commits, Issues, Pull Requests, Pull Request Reviews)*/

interface Breakdown {
  commits: number;
  issues: number;
  pullRequests: number;
  pullRequestReviews: number;
}

interface BarChartProps {
  data: Array<{
    weekStart: string;
    totalContributions: number;
  }>;
  getBreakDown: () => Breakdown;
}

export function BarChart(props: BarChartProps) {
  const data = props.data.map((d) => ({
    ...d,
    weekStart: new Date(d.weekStart),
  }));

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear any previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Data
    // const data = [5, 10, 15, 20, 25];

    // Dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const barWidth = innerWidth / data.length;

    // Create scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.weekStart) as [Date, Date])
      // .domain(data.map((item) => item.weekStart))
      .range([0, innerWidth]);
    // .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.map((i) => i.totalContributions)) as number])
      .range([innerHeight, 0]);

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create container group and transform it
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.weekStart) ?? null)
      .attr("y", (d) => y(d.totalContributions))
      .attr("width", barWidth)
      .attr("height", (d) => innerHeight - y(d.totalContributions))
      .attr("fill", "steelblue")
      .on("mouseenter", (event, d) => {
        const breakdown = props.getBreakDown();

        const series: Array<{ key: string; value: [number, number] }> = [];

        let last = 0;

        for (const breakdownKey in breakdown) {
          const count = breakdown[breakdownKey];
          const top = count + last;

          series.push({ key: breakdownKey, value: [last, top] });

          last = top;
        }

        console.log(series);

        console.log(event, d);

        d3.select(event.target).style("visibility", "hidden");
        // g.selectAll(".stack").data(breakdown);

        /* const color = d3
          .scaleOrdinal()
          .domain(Object.keys(breakdown))
          .range(["#1f77b4", "#ff7f0e", "#2ca02c", "red"]);*/

        const color = {
          commits: "#1f77b4",
          issues: "#ff7f0e",
          pullRequests: "#2ca02c",
          pullRequestReviews: "red",
        };

        g.selectAll(".stack")
          .data(series)
          .enter()
          .append("rect")
          .attr("class", "stack")
          .attr("x", x(d.weekStart) ?? null)
          .attr("fill", (dd) => color[dd.key])
          .attr("y", (dd) => {
            console.log("attr Y", dd);
            return y(dd.value[1]);
          })
          .attr("height", (dd) => y(dd.value[0]) - y(dd.value[1]))
          .attr("width", barWidth)
          .on("mouseleave", () => {
            d3.selectAll(".stack").remove();
            d3.select(event.target).style("visibility", "visible");
          });
      });

    // Add x-axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(d3.timeMonth.every(1)) // one tick per month
          .tickFormat(d3.timeFormat("%b")), // short month names
        0,
      );

    // Add y-axis
    g.append("g").call(d3.axisLeft(y));
  }, []);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
}
