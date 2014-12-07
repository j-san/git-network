define(
    ['knockout', 'chai', '../js/models/app', '../js/models/github', '../js/graph/network'],
    function(ko, chai, AppModel, GithubModel, NetworkGraph) {
    chai.should();

    describe('app model', function (done) {
        it('should has username in title', function () {

            var app = new AppModel();
            // set user name
            app.user('mocha-user-test');

            setTimeout(function () {
               app.title().should.contain('mocha-user-test');
            });
        });
    });

    describe('github model', function () {
        it('should resolve items only once when add multiple elements', function (done) {

            var count = 0;
            var github = new GithubModel();
            github.items.subscribe(function () {
                count++;
            });
            github.addRepo({name: 'test-1', owner: {login: 'a' }}, {login: 'a' });
            github.addRepo({name: 'test-2', owner: {login: 'a' }}, {login: 'a' });
            github.addRepo({name: 'test-3', owner: {login: 'b' }}, {login: 'a' });

            setTimeout(function () {
                // async, lets resolve subscription at next tick
                count.should.equal(1);
                done();
            });
        });

        it('should add a user when add a repo', function () {
            var github = new GithubModel();

            github.addRepo({name: 'test-project-1', owner: {login: 'test-user' }}, {login: 'test-user' });
            github.items().length.should.equal(2);

            var user = ko.utils.arrayFirst(github.items(), function (item) {
                return item.type === 'user';
            });
            user.name.should.equal('test-user');

            var repo = ko.utils.arrayFirst(github.items(), function (item) {
                return item.type === 'repo';
            });
            repo.name.should.equal('test-project-1');
        });

        it('should keep user unique', function () {
            var github = new GithubModel();

            github.addRepo({name: 'test-project-1', owner: {login: 'test-user' }}, {login: 'test-user' });
            github.addRepo({name: 'test-project-2', owner: {login: 'test-user' }}, {login: 'test-user' });
            github.items().length.should.equal(3);

            var user = ko.utils.arrayFirst(github.items(), function (item) {
                return item.type === 'user';
            });
            user.name.should.equal('test-user');

            var repos = ko.utils.arrayFilter(github.items(), function (item) {
                return item.type === 'repo';
            });
            repos.length.should.equal(2);
        });
    });

    describe('network', function () {
        it('should create an svg', function (done) {
            var github = new GithubModel();
            var elem = document.createElement('div');
            var graph = new NetworkGraph(github, elem);

            github.addRepo({name: 'test-project-1', owner: {login: 'test-user' }}, {login: 'test-user' });
            github.addRepo({name: 'test-project-2', owner: {login: 'test-user' }}, {login: 'test-user' });
            github.items().length.should.equal(3);

            setTimeout(function () {
               elem.children.length.should.equal(1);
               var svg = elem.children[0];
               svg.localName.should.equal('svg');
               done();
            });
        });
    });
});