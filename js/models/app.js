define(['knockout'], function(ko) {
    function AppModel() {
        this.title = 'Git Network';
        this.user = ko.observable('');

        this.error = ko.computed(function () {
            if (! this.user()) {
                return 'no user selected';
            }
        }, this);
    }

    return AppModel;
});