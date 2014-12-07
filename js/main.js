require(
['knockout', 'sammy', 'jquery', 'models/app', 'models/github', 'graph/network'],
function(ko, Sammy, $, AppModel, GithubModel, NetworkGraph) {

    var app = new AppModel();
    ko.applyBindings(app, document.getElementById('app'));

    var github = new GithubModel();
    ko.applyBindings(github, document.getElementById('repos'));

    var graph = new NetworkGraph(github, document.getElementById('network-graph'));

    app.user.subscribe(function (value) {
        if (value) {
            document.location.hash = value;
        }
    });

    $(window).on('hashchange', function() {
        var path = document.location.hash;
        if (path && path[0] === '#') {
            path = path.slice(1);
        }
        if (path) {
            if (path !== app.user()) {
                app.user(path);
            }
            github.loadUser({login: app.user()}).get(function () {
                if(!github.items().length) {
                    app.message('Is it a github user?');
                } else {
                    app.message('');
                }
            }, function (jqxhr) {
                if(jqxhr.responseJSON) {
                    app.message(jqxhr.responseJSON.message);
                } else if (jqxhr.statusText) {
                    app.message(jqxhr.statusText);
                } else {
                    app.message(jqxhr);
                }

            });
        }
    }).trigger('hashchange');
});
