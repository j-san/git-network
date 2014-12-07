define(['d3', 'jquery'], function (d3, $) {
    var maxRadius = 30;

    function NetworkGraph(github, elem) {
        var self = this;

        this.force = d3.layout.force();
        this.github = github;

        // max to the available sceen minus a margin
        this.width = Math.min(1000, $(document.body).width() - 40);
        this.height = 800;
        this.maxWeight = 1;

        this.force
            .on("tick", this.tick.bind(this))
            .charge(-120)
            .linkDistance(function(d) {
                return 4 * d.target.radius;
            })
            .size([this.width, this.height]);

        this.vis = d3.select(elem).append('svg')
            .attr("width", this.width)
            .attr("height", this.height);

        this.github.items.subscribe(function (data) {

            self.update(data);
        });
    }

    NetworkGraph.prototype.update = function (data) {
        var self = this;

        self.nodes = data;

        this.nodes.forEach(function (node, index) {
            if(!node.id) {
               node.id = index + 1;
            }

            node.weight = Math.sqrt(node.stars + 1);
            if (node.weight > self.maxWeight) {
                self.maxWeight = node.weight;
            }
        });
        this.nodes.forEach(function (node, index) {
            if (node.type === 'repo') {
                node.radius = maxRadius * node.weight / self.maxWeight;
            } else {
                node.radius = 10;
            }
        });
        this.links = this.makeLinks(this.nodes);

        // Restart the force layout.
        this.force
          .nodes(this.nodes)
          .links(this.links)
          .start();

        // Update the links.
        this.link = this.vis.selectAll("line.link")
            .data(this.links, function(d) { return d.source.id + '-' + d.target.id; });

        // Enter any new links.
        this.link.enter().insert("line", ".node")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        // Exit any old links.
        this.link.exit().remove();

        // Update the nodes.
        this.node = this.vis.selectAll("g.node")
            .data(this.nodes, function(d) { return d.id; });

        // Enter any new nodes.
        this.node.enter()
            .append('g')
            .attr('class', 'node');

        this.node.selectAll("circle")
            .attr("r", function(d) {
                return d.radius;
            });

        this.node
            .append("circle")
            .attr("class", function (d) {
                return d.type;
            })
            .attr("r", function(d) {
                return d.radius;
            })
            .on("click", this.click.bind(this))
            .call(this.force.drag);

        this.node
            .append("text")
            .attr("dx", function (d) { return d.radius * 0.8; })
            .attr("dy", function (d) { return d.radius * 1; })
            .text(function(d) { return d.name; });

        // Exit any old nodes.
        this.node.exit().remove();
    };

    NetworkGraph.prototype.makeLinks = function (nodes) {
        var links = [];
        nodes.forEach(function (node) {
            if ('children' in node) {
                node.children.forEach(function (child) {
                    links.push({source: node, target: child});
                });
            }
        });
        return links;
    };

    NetworkGraph.prototype.tick = function () {
        this.link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        this.node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    };

    NetworkGraph.prototype.click = function (d) {
        if (d.type === 'repo') {
            this.github.loadRepo(d);
        }
    };


    return NetworkGraph;
});
