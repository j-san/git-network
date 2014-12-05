define(['d3', 'jquery'], function (d3, $) {
    var maxRadius = 40;

    function NetworkGraph(github, elem) {
        var self = this;

        this.container = $(elem);
        this.force = d3.layout.force();
        this.github = github;

        // max to the available sceen minus a margin
        this.width = Math.min(1000, this.container.width() - 40);
        this.height = 800;
        this.maxStars = 1;

        this.force
            .on("tick", this.tick.bind(this))
            .linkDistance(function(d) {
                return 100 * (d.target.stars + 1) / self.maxStars;
            })
            .size([this.width, this.height]);

        this.vis = d3.select(this.container[0]).append('svg')
            .attr("width", this.width)
            .attr("height", this.height);

        this.github.items.subscribe(function (data) {
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
        nodes.forEach(function (node, index) {
            node.radius = maxRadius * (node.stars + 1) / (self.maxStars + 1);
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
        this.link.enter().insert("line", ".node")
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
        this.node.enter()
            .append('g')
            .attr('class', 'node');

        this.node
            .append("circle")
            .attr("class", function (d) {
                return d.type;
            })
            .attr("r", function(d) {
                return d.type === 'repo' ? d.radius : 10;
            })
            .on("click", this.click.bind(this))
            .call(this.force.drag);

        this.node
            .append("text")
            .attr("dx", function (d) { return d.radius * 0.9; })
            .attr("dy", function (d) { return d.radius * 0.7; })
            .text(function(d) { return d.radius > 8 ? d.name : ''; });

        // Exit any old nodes.
        this.node.exit().remove();
    };

    NetworkGraph.prototype.tick = function tick() {
        this.link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        this.node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    };

    NetworkGraph.prototype.click = function click(d) {
        // this.github.load(d);
    };


    return NetworkGraph;
});
