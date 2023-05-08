import type { FigureSource } from "./Gallery";
import * as d3 from "d3";

export const plotSParams = (
  data: FigureSource["data"],
  cols: FigureSource["cols"],
  figureSVGRef?: SVGElement,
) => {
  /** width = 72 dpi * 3.5 in */
  const width = Math.round(72 * 3.5);
  /** width = 72 dpi * 2.5 in */
  const height = Math.round(72 * 2.8);
  const margin = {
    top: 20,
    bottom: 45,
    left: 55,
    right: 10,
  };

  if (figureSVGRef === undefined) return;
  if (data.length === 0) return;

  // Data
  const dataT = d3.transpose(data) as number[][];
  const x = dataT[0];
  const y = dataT.splice(1);
  const dataP = y.map((d) => d3.zip(x, d) as [number, number][]);

  // const isDefined = (d, i) => !isNaN(x[i]) && !isNaN()
  const xDomain = d3.extent(x) as [number, number];
  const xRange = [margin.left, width - margin.right];
  const xScale = d3.scaleLinear(xDomain, xRange);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0).tickPadding(0);
  const xGrid = (g: d3.Selection<SVGGElement, unknown, null, unknown>) =>
    g
      .selectAll("line")
      .data(xScale.ticks())
      .join("line")
      .attr("stroke-linecap", "round")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "1");

  const yDomain = [-40, 0];
  const yRange = [height - margin.bottom, margin.top];
  const yScale = d3.scaleLinear(yDomain, yRange);
  const yAxis = d3
    .axisLeft(yScale)
    .ticks((yDomain[1] - yDomain[0]) / 10)
    .tickSizeOuter(0)
    .tickPadding(0);
  const yGrid = (g: d3.Selection<SVGGElement, unknown, null, unknown>) =>
    g
      .selectAll("line")
      .data(yScale.ticks((yDomain[1] - yDomain[0]) / 10))
      .join("line")
      .attr("stroke-linecap", "round")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "1");

  const trace = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]));

  // SVG
  const svg = d3
    .select(figureSVGRef)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewbox", [0, 0, width, height])
    .style("font-size", "10pt");
  // .on("touchstart", (e: TouchEvent) => e.preventDefault());

  // X grid
  svg.append("g").call(xGrid);
  // Y grid
  svg.append("g").call(yGrid);
  // Traces
  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "currentColor")
    .attr("stroke-linecap", "round")
    .selectAll("path")
    .data(dataP)
    .join("path")
    .attr("d", (d) => trace(d))
    .attr("stroke", (_, i) => d3.schemeTableau10[i])
    .attr("stroke-dasharray", (_, i) => (i % 2 ? "5" : null))
    .attr("fill", "none")
    .attr("stroke-linejoin", "round");

  // X axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .attr("font-size", "10pt")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .call((g) =>
      g
        .selectAll("line")
        .attr("y2", -xAxis.tickSize())
        .attr("stroke-linecap", "round"),
    )
    .call((g) =>
      g
        .select("g:last-child>line")
        .attr("y2", -yScale(yDomain[0]) + margin.top),
    )
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", xScale(d3.mean(xDomain) as number))
    .attr("y", 35)
    .attr("fill", "currentColor")
    .text("Frequency (GHz)")
    .attr("font-size", "10pt")
    .attr("font-family", "Arial, Helvetica, sans-serif");

  // Y axis
  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .attr("font-size", "10pt")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .call((g) =>
      g
        .selectAll("line")
        .attr("x2", yAxis.tickSize())
        .attr("stroke-linecap", "round"),
    )
    .call((g) =>
      g
        .select("g:last-child>line")
        .attr("x2", xScale(xDomain[1]) - margin.left),
    )
    .call((g) => g.selectAll("path").attr("stroke-linecap", "round"))
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -35)
    .attr("x", -yScale(d3.mean(yDomain) as number))
    .attr("fill", "currentColor")
    .text("Scattering Parameters (dB)");
};

export const plotPattern = (
  data: FigureSource["data"],
  cols: FigureSource["cols"],
  figureSVGRef?: SVGElement,
) => {
  if (figureSVGRef === undefined) return;
  return;
};
