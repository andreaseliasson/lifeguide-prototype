d3.json("data/all-page-flow15.json", createAdjacencyMatrix);

function createAdjacencyMatrix(data) {

  var adjacencyMatrix = d3.layout.adjacencyMatrix()
    .size([800,800])
    .nodes(data.nodes)
    .links(data.links)
    .directed(true)
    .nodeID(function (d) {return d.name});

  var matrixData = adjacencyMatrix();

  console.log(matrixData);
  console.log(data.nodes.length + " nodes");
  console.log(data.links.length + " links");

  var someColors = d3.scale.category20b();

  var colors = ['#fdbe85','#fd8d3c','#d94701'];
  console.log(d3.max(matrixData, function (d) {return d.value}));

  var colorScale = d3.scale.quantile()
    .domain([0, d3.max(matrixData, function (d) { return d.value})])
    .range(colors);

  d3.select("svg")
    .append("g")
    .attr("transform", "translate(80,80)")
    .attr("id", "adjacencyG")
    .selectAll("rect")
    .data(matrixData)
    .enter()
    .append("rect")
    .attr("width", function (d) {return d.width})
    .attr("height", function (d) {return d.height})
    .attr("x", function (d) {return d.x})
    .attr("y", function (d) {return d.y})
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("stroke-opacity", .1)
    .style("fill", function (d) {return colorScale(d.value)})
    .style("fill-opacity", function (d) {return d.weight * .8})
    .append('title')
    .text(function(d) {
      return d.source.name + " -> " + d.target.name + ": " + d.value;
    });

  d3.select("#adjacencyG")
    .call(adjacencyMatrix.xAxis);

  d3.select("#adjacencyG")
    .call(adjacencyMatrix.yAxis);
}