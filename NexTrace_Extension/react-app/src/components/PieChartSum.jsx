import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

export default function PieChartSum(props) {
  const { reqData } = props;

  const newObj = {};
  reqData.forEach(obj => {
    if(!newObj[obj.name]){
        newObj[obj.name] = {duration: obj.duration}
    } else {
      newObj[obj.name].duration += obj.duration;
    }
  })
  
  const data = Object.entries(newObj).map(([name, group]) => {
      const sumDuration = group.duration;
      return { label: name, value: sumDuration };
  });

  // Dimensions
  let width, height;
  data.length > 0 ? [width, height] = [window.innerWidth * 0.3, window.innerWidth * 0.3] : [width, height] = [0, 0];
  const radius = Math.min(width, height) / 2;
  
  // created adjusted dataset for relative start times
  useEffect(() => {
    const container = document.getElementById('pie-sum-duration');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

      // Create SVG container
    const svg = d3.select('#pie-sum-duration')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // Generate an array of random colors
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Pie layout
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    // Arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Create arcs
    const g = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', (d, i) => colorScale(i));

    // Optional: Add labels
    g.append('text')
      .attr('transform', d => 'translate(' + arc.centroid(d) + ')')
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text(d => d.data.label);

  }, [data]);

    return (
            <span className='pieChart' id='pie-sum-duration'></span>
    );
}
