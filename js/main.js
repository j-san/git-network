require(
['knockout', 'sammy', 'jquery', 'models/app', 'models/github', 'graph/network'],
function(ko, Sammy, $, AppModel, GithubModel, NetworkGraph) {

    var app = new AppModel();
    ko.applyBindings(app, document.getElementById('app'));

    var github = new GithubModel();
    ko.applyBindings(github, document.getElementById('repos'));

    var graph = new NetworkGraph(github);

    var GITHUB_REPOS_URL = 'https://api.github.com/users/:user/repos';

    function loadUser (username) {
        app.user(username);
        var url = GITHUB_REPOS_URL.replace(':user', app.user());

        $.get(url, function (results) {
            results.forEach(function (repo) {
                github.addRepo(repo);
            });
        });
    }

    Sammy(function() {
        this.get('#:user', function() {
            loadUser(this.params.user);
        });

        this.get('', function() {});
    }).run();
});
