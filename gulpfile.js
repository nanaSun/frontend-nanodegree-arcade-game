var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	connect = require('gulp-connect');

gulp.task('connect', function() {
   connect.server({
    port:80,
    livereload: true
  });
});


gulp.task('check', function() {
    return gulp.src('./js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default', ["connect"]);
gulp.task('serve', ["connect"]);