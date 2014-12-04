define(['d3', 'jquery'], function (d3, $) {
    var force = d3.layout.force(),
        maxRadius = 40,
        node,
        link,
        vis,
        maxStars = 1,
        root;

    function NetworkGraph(github) {
        var self = this;

        this.container = $('#graph-proximity');

        // max to the available sceen minus a margin
        this.width = Math.min(1000, this.container.width() - 40);
        this.height = 800;

        force
            .on("tick", tick)
            .size([this.width, this.height]);


        vis = d3.select(this.container[0]).append('svg:svg')
            .attr("width", this.width)
            .attr("height", this.height);

        github.items.subscribe(function (data) {
            // if (!self.dirty) {
                // setTimeout(function () {
                    self.update(data);
                // });
            // }
            self.dirty = true;
        });
    }

    NetworkGraph.prototype.update = function (data) {
        console.log('update');
        this.dirty = false;

        root = data;
        root.fixed = true;
        root.x = this.width / 2;
        root.y = this.height / 2 - 80;

        var nodes = root,
            links = d3.layout.tree().links(nodes);

        nodes.forEach(function (node, index) {
            node.id = index + 1;

            if (node.stars > maxStars) {
                maxStars = node.stars;
            }
        });
        // Restart the force layout.
        force
          .nodes(nodes)
          .links(links)
          .start();

        // Update the links.
        link = vis.selectAll("line.link")
          .data(links, function(d) { return d.target.id; });

        // Enter any new links.
        link.enter().insert("svg:line", ".node")
          .attr("class", "link")
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        // Exit any old links.
        link.exit().remove();

        // Update the nodesnodes.
        node = vis.selectAll("circle.node")
          .data(nodes, function(d) { return d.id; })
          .style("fill", "#ccc");

        node.transition()
          .attr("r", 5);

        // Enter any new nodes.
        node.enter().append("svg:circle")
            .attr("class", function (d) {
                return "node " + d.type;
            })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) {
                return d.type === 'repo' ?
                    maxRadius * (d.stars + 1) / maxStars :
                    10;
            })
            .on("click", this.click.bind(this))
            .call(force.drag);

        // Exit any old nodes.
        node.exit().remove();
    };

    function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    // Toggle children on click.
    NetworkGraph.prototype.click = function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        this.update();
    }


    return NetworkGraph;
});
