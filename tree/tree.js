var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  g = svg.append("g").attr("transform", "translate(60,0)");

var tree = d3.tree()
  .size([height, width - 160]);

var stratify = d3.stratify()
  .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

d3.csv("data/tree0.csv", function(error, data) {
  if (error) throw error;
  console.log(data.length + " paths");

  var root = stratify(data)
    .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

  var linkScale = d3.scaleLinear()
    .domain([2, d3.max(data, function (d) {
      return d.value;
    })])
    .range([1.25, 1.7]);

  var link = g.selectAll(".link")
    .data(tree(root).links())
    .enter().append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal()
      .x(function(d) { return d.y; })
      .y(function(d) { return d.x; }))
    .style("stroke-width", function (d) {
      return linkScale(d.target.data.value).toString() + "px";
    });

  var node = g.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  var rScale = d3.scaleLinear()
    .domain([2, d3.max(data, function (d) {
      return parseInt(d.value);
    })])
    .range([2.5, 7]);

  node.append("circle")
    .attr("r", function (d) {
      return rScale(parseInt(d.data.value));
    });

  node.append("title")
    .text(function (d) {
      var output = "";
      d.id.split(".").forEach(function (page) {
        output += page + "->" + " ";
      });
      return output.slice(0, output.lastIndexOf("->")) + ": " + d.data.value;
    });

  node.append("text")
    .attr("dy", 3)
    .attr("x", function(d) { return d.children ? -8 : 8; })
    .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
    .text(function(d) {
      return d.id.substring(d.id.lastIndexOf(".") + 1);
    });
});