var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();

gulp.task('less', function () {
        console.log(path.join(__dirname, 'bower_components', 'bootstrap', 'less'));
    return gulp.src('./less/**/*.less')
        .pipe($.less({
            paths: [
                path.join(__dirname, 'bower_components', 'bootstrap', 'less')
            ]
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('jshint', function () {
    return gulp.src('js/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('watch-less', function () {
    gulp.run('less');
    gulp.watch('less/**/*.less', ['less']);
});

gulp.task('default', ['jshint']);
gulp.task('dist', ['less']);
