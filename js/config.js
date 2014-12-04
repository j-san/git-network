require.config({
  paths: {
    knockout: "../bower_components/knockout/dist/knockout",
    requirejs: "../bower_components/requirejs/require",
    jquery: "../bower_components/jquery/dist/jquery",
    bootstrap: "../bower_components/bootstrap/dist/js/bootstrap",
    sammy: "../bower_components/sammy/lib/sammy",
    d3: "../bower_components/d3/d3"
  },
  packages: [

  ]
});

require(['main'], function(){});
