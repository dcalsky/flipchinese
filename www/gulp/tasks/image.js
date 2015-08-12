let gulp = require('gulp');
let imagemin = require('gulp-imagemin');
let pngquant = require('imagemin-pngquant');

gulp.task('image', function () {
    return gulp.src('src/www/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/web/images'));
});