define(['knockout'], function (ko) {
    function GithubModel() {
        this.items = ko.observableArray();
        // Do refresh once async
        this.items.extend({rateLimit: 0});

        this.mode = ko.observable('graph');
        this.modes = ['graph', 'text'];
    }

    GithubModel.prototype.addRepo = function(repo) {

        var repository = {
            type:  'repo',
            name:  repo.name,
            key:   repo.full_name,
            stars: repo.stargazers_count,
        };

        var owner = ko.utils.arrayFirst(this.items(), function (item) {
            return item.type === 'user' &&
                   item.name === repo.owner.login;
        });

        if (!owner) {
            owner = {
                type: 'user',
                name: repo.owner.login,
                children: []
            };
            this.items.push(owner);
        }
        owner.children.push(repository);

        this.items.push(repository);
    };

    return GithubModel;
});