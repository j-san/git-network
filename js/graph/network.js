define(['d3', 'jquery'], function (d3, $) {
    var maxRadius = 40;

    function NetworkGraph(github) {
        var self = this;

        this.container = $('#graph-proximity');
        this.force = d3.layout.force();

        // max to the available sceen minus a margin
        this.width = Math.min(1000, this.container.width() - 40);
        this.height = 800;
        this.maxStars = 1;

        this.force
            .on("tick", this.tick.bind(this))
            .charge(function(d) {
                return d._children ? -d.size / 100 : -30;
            })
            .linkDistance(function(d) {
                return d.target.stars ;
            })
            .size([this.width, this.height]);

        this.vis = d3.select(this.container[0]).append('svg:svg')
            .attr("width", this.width)
            .attr("height", this.height);

        github.items.subscribe(function (data) {
            self.root = data;
            self.root.fixed = true;
            self.root.x = self.width / 2;
            self.root.y = self.height / 2 - 80;

            self.update();
        });
    }

    NetworkGraph.prototype.update = function () {
        var self = this,
            nodes = this.root,
            links = d3.layout.tree().links(nodes);

        nodes.forEach(function (node, index) {
            node.id = index + 1;

            if (node.stars > self.maxStars) {
                self.maxStars = node.stars;
            }
        });

        // Restart the force layout.
        this.force
          .nodes(nodes)
          .links(links)
          .start();

        // Update the links.
        this.link = this.vis.selectAll("line.link")
            .data(links, function(d) { return d.target.id; });

        // Enter any new links.
        this.link.enter().insert("svg:line", ".node")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        // Exit any old links.
        this.link.exit().remove();

        // Update the nodes.
        this.node = this.vis.selectAll("circle.node")
            .data(nodes, function(d) { return d.id; });

        // Enter any new nodes.
        this.node.enter().append("svg:circle")
            .attr("class", function (d) {
                return "node " + d.type;
            })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d) {
                return d.type === 'repo' ?
                    maxRadius * (d.stars + 1) / self.maxStars :
                    10;
            })
            .on("click", this.click.bind(this))
            .call(this.force.drag);

        // Exit any old nodes.
        this.node.exit().remove();
    };

    NetworkGraph.prototype.tick = function tick() {
        this.link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        this.node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    };

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
    };


    return NetworkGraph;
});
