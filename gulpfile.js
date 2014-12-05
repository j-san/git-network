var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();

gulp.task('less', function () {
    return gulp.src('./less/main.less')
        .pipe($.less({
            paths: [
                path.join(__dirname, 'bower_components', 'bootstrap', 'less')
            ]
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch-less', function () {
    gulp.run('less');
    gulp.watch('less/**/*.less', ['less']);
});

gulp.task('jshint', function () {
    return gulp.src(['js/**/*.js', 'test/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('phantom-test', function () {
  return gulp
      .src('test/index.html')
      .pipe($.mochaPhantomjs());
});

gulp.task('testem', function () {
    var testem = require('testem');
    var api = new testem();
    api.startCI({
        test_page: 'test/index.html',
        launch: 'phantomjs,firefox'
    });
});

gulp.task('default', ['jshint']);
gulp.task('dist', ['less']);
gulp.task('test', ['jshint', 'testem']);
