define(['knockout'], function(ko) {
    function AppModel() {
        this.user = ko.observable('');
        this.message = ko.observable('Select a Github user');

        this.error = ko.computed(function () {
            return this.message();
        }, this);

        this.user.subscribe(function (user) {
            if (!user) {
                this.message('Select a Github user');
            }
        }, this);

        this.title = ko.computed(function () {
            if (this.message()) {
                return this.message();
            }
            return this.user() + '\'s Git Network';
        }, this);

    }

    return AppModel;
});