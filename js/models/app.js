define(['knockout'], function(ko) {
    function AppModel() {
        this.title = '';
        this.user = ko.observable('');

        this.error = ko.computed(function () {
            if (! this.user()) {
                return 'no user selected';
            }
        }, this);

        this.title = ko.computed(function () {
            return this.user() + '\'s Git Network';
        }, this);
    }

    return AppModel;
});