// var gulp = require('gulp');
// var config = require('../config').css;
// var compass = require('gulp-compass'),
// 	plumber = require('gulp-plumber'),
// 	minifyCSS = require('gulp-minify-css');

var gulp = require('gulp');
var shell = require('gulp-shell')
var config = require('../config').css;

gulp.task('css', ['scss','dest']);

gulp.task('dest', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});

// gulp.task('scss',function(){
//   return gulp.src(config.scss)
//   .pipe(plumber({
//       errorHandler: function (error) {
//         console.log(error.message);
//         this.emit('end');
//     }}))
//     .pipe(compass({
//       css: './build/web',
//       sass: './src/css'
//     }))
//     .on('error', function(err) {
//       // Would like to catch the error here
//     })
//     .pipe(minifyCSS())
//     .pipe(gulp.dest(config.dest));
// })


gulp.task('scss', shell.task([
  'scss --sourcemap=none -t=compressed src/css/home.scss:build/web/home.css',
  'scss --sourcemap=none -t=compressed src/css/left-nav.scss:build/web/left-nav.css',
  'scss --sourcemap=none -t=compressed src/css/content.scss:build/web/content.css',
  'scss --sourcemap=none -t=compressed src/css/tab.scss:build/web/tab.css'
]))

