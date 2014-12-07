require(
['knockout', 'sammy', 'jquery', 'models/app', 'models/github', 'graph/network'],
function(ko, Sammy, $, AppModel, GithubModel, NetworkGraph) {

    var app = new AppModel();
    ko.applyBindings(app, document.getElementById('app'));

    var github = new GithubModel();
    ko.applyBindings(github, document.getElementById('repos'));

    var graph = new NetworkGraph(github, document.getElementById('network-graph'));

    Sammy(function() {
        this.get('#:user', function() {
            app.user(this.params.user);
            github.loadUser({login: app.user()});
        });

        this.get('', function() {});
    }).run();
});
