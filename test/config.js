require.config({
    paths: {
        knockout: "../bower_components/knockout/dist/knockout",
        requirejs: "../bower_components/requirejs/require",
        jquery: "../bower_components/jquery/dist/jquery",
        bootstrap: "../bower_components/bootstrap/dist/js/bootstrap",
        sammy: "../bower_components/sammy/lib/sammy",
        d3: "../bower_components/d3/d3",
        chai: "../bower_components/chai/chai",
        blanket: "../bower_components/blanket/dist/qunit/blanket",
        "mocha-blanket": "../bower_components/blanket/src/adapters/mocha-blanket"
    },
    packages: [

    ]
});

require(['tests'], function() {
    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    }
    else {
        mocha.run();
    }
});
