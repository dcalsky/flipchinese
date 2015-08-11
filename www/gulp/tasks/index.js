var gulp = require('gulp');
var config = require('../config');

gulp.task('index', function() {
  return gulp.src(config.index.src)
    .pipe(gulp.dest('./build'));
});
