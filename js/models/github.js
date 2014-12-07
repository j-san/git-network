define(['knockout'], function (ko) {
    var GITHUB_USER_REPOS_URL = 'https://api.github.com/users/:user/repos';
    var GITHUB_REPO_USERS_URL = 'https://api.github.com/repos/:owner/:repo/contributors';

    function GithubModel() {
        this.items = ko.observableArray();
        // Do refresh once async
        this.items.extend({rateLimit: 0});

        this.mode = ko.observable('graph');
        this.modes = ['graph', 'text'];

        this.error = ko.observable();
    }

    GithubModel.prototype.addRepo = function(repo, user) {
        user = this.addUser(user);
        var newRepo = this.findRepo(repo);

        if (!newRepo) {
            newRepo = {
                type:      'repo',
                name:      repo.name,
                full_name: repo.full_name,
                owner:     repo.owner.login,
                stars:     repo.stargazers_count,
            };
            this.items.push(newRepo);
        }

        user.children.push(newRepo);
        return newRepo;
    };

    GithubModel.prototype.addUser = function(user) {
        var newUser = this.findUser(user);

        if (!newUser) {
            newUser = {
                type: 'user',
                name: user.login,
                children: []
            };
            this.items.push(newUser);
        }
        return newUser;
    };

    GithubModel.prototype.findUser = function (user) {
        return ko.utils.arrayFirst(this.items(), function (item) {
            return item.type === 'user' &&
                   item.name === user.login;
        });
    };

    GithubModel.prototype.findRepo = function (repo) {
        return ko.utils.arrayFirst(this.items(), function (item) {
            return item.type === 'repo' &&
                   item.name === repo.name;
        });
    };


    GithubModel.prototype.loadUser = function (user) {
        var self = this;
        var url = GITHUB_USER_REPOS_URL.replace(':user', user.login);

        this.error('');

        return $.get(url).then(function (results) {
            results.forEach(function (repo) {
                self.addRepo(repo, user);
            });
        }, function (jqxhr) { self.fallback(jqxhr); });
    };

    GithubModel.prototype.loadRepo = function (repo) {
        var self = this;
        var url = GITHUB_REPO_USERS_URL.replace(':owner', repo.owner).replace(':repo', repo.name);

        this.error('');

        return $.get(url).then(function (results) {

            results.forEach(function (result) {

                var user = self.findUser(result);
                self.addRepo(repo, user || result);
                if(!user) {
                    self.loadUser(result);
                } else {
                    user.children.push(repo);
                }
            });
        }, function (jqxhr) { self.fallback(jqxhr); });
    };

    GithubModel.prototype.fallback = function (jqxhr) {
        if(jqxhr.responseJSON) {
            this.error(jqxhr.responseJSON.message);
        } else if (jqxhr.statusText) {
            this.error(jqxhr.statusText);
        } else {
            this.error(jqxhr);
        }
    };

    return GithubModel;
});