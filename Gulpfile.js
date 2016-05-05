var gulp = require('gulp');
var minifyCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyHTML = require('gulp-minify-html');

// Move GTFS files
gulp.task('move-gtfs-files', function() {
  gulp.src('./src/gtfs/*.txt')
    .pipe(gulp.dest('./dist/gtfs'));
});

// Minify CSS
gulp.task('minify-css', function() {
  gulp.src('./src/css/*.css')
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(rename('bundle.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./dist/css'));
});

// Minify JavaScript
gulp.task('minify-js', function() {
  gulp.src(/*'./src/js/*.js'*/ 
    ['./src/js/index.js',
    './src/js/helpers.js',
    './src/js/indexeddb.js',
    './src/js/app-caltrain-data.js',
    './src/js/app-handlers.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(rename('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('minify-sw', function() {
  gulp.src('./src/sw.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

// Minify HTML
gulp.task('minify-html', function() {
  gulp.src('./src/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./dist'));
});

// Default
gulp.task('default', ['minify-css', 'minify-js', 'minify-sw', 'minify-html', 'move-gtfs-files'], function() {
  
  gulp.watch(['./src/gtfs/*.txt'], ['move-gtfs-files']);
  gulp.watch(['./src/index.html'], ['minify-html']);
  gulp.watch(['./src/js/*.js'], ['minify-js']);
  gulp.watch(['./src/sw.js'], ['minify-sw']);
  gulp.watch(['./src/css/*.css'], ['minify-css']);

});