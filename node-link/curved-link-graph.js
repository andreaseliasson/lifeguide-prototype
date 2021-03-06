var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

function zoomed() {
  var transform = d3.event.transform;
  svg.attr("transform", function(d) {
    return "translate(" + transform.applyX(d[0]) + "," + transform.applyY(d[1]) + ")";
  });
}

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().distance(5).strength(0.25))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));

//  var simulation = cola.d3adaptor()
//    .linkDistance(30)
//    .size([width, height]);

d3.json("data/all-page-flow1.json", function(error, graph) {
  if (error) throw error;
  console.log(graph.nodes.length);
  console.log(graph.links.length);

  var nodes = graph.nodes,
//      nodeById = d3.map(nodes, function(d) { return d.id; }),
    links = graph.links,
    bilinks = [];

  links.forEach(function(link) {
//      var s = link.source = nodeById.get(link.source),
//        t = link.target = nodeById.get(link.target),
//        i = {}; // intermediate node
    var s = nodes[link.source],
      t = nodes[link.target],
      i = {}; // intermediate node
    nodes.push(i);
    links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
  });

  var link = svg.selectAll(".link")
    .data(bilinks)
    .enter().append("path")
    .attr("class", "link");

  var rscale = d3.scaleLinear()
    .domain([2, d3.max(nodes, function(d) { return d.visits;})])
    .range([5,25]);

  var node = svg.selectAll(".node")
    .data(nodes.filter(function(d) { return d.name; }))
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", function(d) { return rscale(d.visits); })
    .attr("fill", function(d) {
      if (d.name == "homepage") {
        return '#ef8a62';
      } else {
        return '#67a9cf';
      }
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("title")
    .text(function(d) {
      console.log(d);
      return d.name + " visits: " + d.visits;
    });

  simulation
    .nodes(nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(links);

  function ticked() {
    link.attr("d", positionLink);
    node.attr("transform", positionNode);
  }

});

function positionLink(d) {
  return "M" + d[0].x + "," + d[0].y
    + "S" + d[1].x + "," + d[1].y
    + " " + d[2].x + "," + d[2].y;
}

function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x, d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x, d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null, d.fy = null;
}