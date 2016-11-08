/*!
 * $ npm install
 * $ gulp
 * $ gulp watch
 */
// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    documentation = require('gulp-documentation'),
    del = require('del');
// Styles
gulp.task('styles', function() {
  return sass('assets/scss/stylesheet.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});
gulp.task('documentation', function () {
  return gulp.src([
      'assets/js/pointCloud.js'
    ])
    .pipe(concat('main_documentation.js'))
    .pipe(gulp.dest('documentation'))
    .pipe(documentation({ format: 'html' }))
    .pipe(gulp.dest('documentation'));
  
});
// Scripts
gulp.task('scripts', function() {
  return gulp.src([
      'assets/js/pointCloud.js'
    ])
    .pipe(concat('pointCloud.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Scripts
gulp.task('example_scripts', function() {
  return gulp.src([
      'assets/js/example.js'
    ])
    .pipe(concat('example.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});


// Clean
gulp.task('clean', function() {
  return del(['dist/css', 'dist/js', 'dist/images']);
});
// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles',  'scripts','example_scripts', 'documentation');
});
// Watch
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('assets/scss/**/*.scss', ['styles']);
  // Watch .js files
  gulp.watch('assets/js/**/*.js', ['scripts','example_scripts','documentation']);

});
