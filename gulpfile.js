var gulp = require('gulp');
var browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));

const paths = {
  src: './',
  css: './css/',
};

// Static Server + watching scss/html files
gulp.task('serve', function () {
  browserSync.init({
    server: paths.src,
  });

  gulp.watch(['./sass/**/*.scss'], gulp.series('compile-sass'));
  gulp.watch(paths.src + '**/*').on('change', browserSync.reload);
});

// compile sass into css
gulp.task('compile-sass', function () {
  return gulp.src('./sass/**/*.scss').pipe(sass()).pipe(gulp.dest(paths.css));
});

gulp.task('default', gulp.series('compile-sass', 'serve'));
