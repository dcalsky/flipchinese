var gulp = require('gulp');

gulp.task('build', ['browserify', 'markup','index', 'css','image']);
