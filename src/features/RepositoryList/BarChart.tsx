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

type SVGGroup = d3.Selection<SVGGElement, unknown, null, undefined>;
type XScale = d3.ScaleTime<number, number>;
type YScale = d3.ScaleLinear<number, number>;

class D3Chart {
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };
  private x: XScale;
  private y: YScale;
  private g: SVGGroup;
  private timeoutId?: NodeJS.Timeout;

  constructor(
    private svgRef: SVGSVGElement,
    private data: WeeklyContributions[],
    private dimensions: Vector,
    private getBreakDown: (
      weeklyContributions: WeeklyContributions,
    ) => Promise<Breakdown>,
  ) {
    this.clear();

    this.x = this.createXScale();
    this.y = this.createYScale();

    this.g = this.createGroup();

    this.setupBars();

    this.drawScales();
  }

  setupBars() {
    this.g
      .selectAll(".bar")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => this.x(d.weekStartDate!) ?? null)
      .attr("y", (d) => this.y(d.totalContributions))
      .attr("width", this.barWidth)
      .attr("height", (d) => this.innerHeight - this.y(d.totalContributions))
      .attr("fill", "steelblue")
      .attr("cursor", "pointer")
      .on("click", this.handleClick);
  }

  handleClick = (_: unknown, d: WeeklyContributions) => {
    clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(async () => {
      d3.selectAll(".stack").remove();

      const breakdown = await this.getBreakDown(d);

      const series: Array<{ key: string; value: [number, number] }> = [];

      let last = 0;

      for (const breakdownKey in breakdown) {
        // @ts-expect-error key type
        const count = breakdown[breakdownKey];
        const top = count + last;

        series.push({ key: breakdownKey, value: [last, top] });

        last = top;
      }

      const color = {
        commits: "#fffe78",
        issues: "#ff9d42",
        pullRequests: "#52ff52",
        pullRequestReviews: "#d34f8c",
      };

      this.g
        .selectAll(".stack")
        .data(series)
        .enter()
        .append("rect")
        .attr("class", "stack")
        .attr("x", this.x(d.weekStartDate!) ?? null)
        // @ts-expect-error key type
        .attr("fill", (dd) => color[dd.key])
        .attr("y", (dd) => this.y(dd.value[1]))
        .attr("height", (dd) => this.y(dd.value[0]) - this.y(dd.value[1]))
        .attr("width", this.barWidth)
        .on("mouseleave", () => {
          d3.selectAll(".stack").remove();
        });
    }, 100);
  };

  createXScale() {
    return d3
      .scaleTime()
      .domain(d3.extent(this.data, (d) => d.weekStartDate) as [Date, Date])
      .range([0, this.innerWidth]);
  }

  createYScale() {
    return d3
      .scaleLinear()
      .domain([0, d3.max(this.data.map((i) => i.totalContributions)) as number])
      .range([this.innerHeight, 0]);
  }

  drawScales() {
    this.g
      .append("g")
      .attr("transform", `translate(0,${this.innerHeight})`)
      .call(
        d3
          .axisBottom(this.x)
          .ticks(d3.timeMonth.every(1))
          // @ts-expect-error d3 type error
          .tickFormat(d3.timeFormat("%b")), // short month names
        0,
      );

    this.g.append("g").call(d3.axisLeft(this.y));
  }

  createGroup() {
    const svg = d3
      .select(this.svgRef)
      .attr("viewBox", [0, 0, this.width, this.height]);

    return svg
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
  }

  clear() {
    d3.select(this.svgRef).selectAll("*").remove();
  }

  get width() {
    return this.dimensions.x;
  }

  get height() {
    return this.dimensions.y;
  }

  get innerWidth() {
    return this.width - this.margin.left - this.margin.right;
  }

  get innerHeight() {
    return this.height - this.margin.top - this.margin.bottom;
  }

  get barWidth() {
    return this.innerWidth / this.data.length;
  }
}

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
      new D3Chart(
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
      new D3Chart(
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
