var gulp = require('gulp');
var config = require('../config').css;
var compass = require('gulp-compass'),
	plumber = require('gulp-plumber'),
	minifyCSS = require('gulp-minify-css');

gulp.task('css', function() {
  return gulp.src(config.src)
	.pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(compass({
      css: './build',
      sass: './src/css'
    }))
    .on('error', function(err) {
      // Would like to catch the error here
    })
    .pipe(minifyCSS())
    .pipe(gulp.dest(config.dest));
});
