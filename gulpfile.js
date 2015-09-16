'use strict';

var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpFilter = require('gulp-filter');
var bowerSrc = require('gulp-bower-src');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var ghPages = require('gulp-gh-pages');
var minifyCss = require("gulp-minify-css");

require('gulp-grunt')(gulp);

//DEV TASKS
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./static",
            middleware: function (req, res, next) {
              console.log('Adding CORS header for ' + req.method + ': ' + req.url);
              res.setHeader('Access-Control-Allow-Origin', '*');
              next();
            }
        }
    });

    gulp.watch('static/assets/**/*.scss', ['sass']);
    gulp.watch("static/*.html").on('change', browserSync.reload);
    gulp.watch(['static/scripts/*.js', 'static/css/*.css'], ['grunt-injector']);
});

gulp.task('sass', function() {
  gulp.src('static/assets/sass/*.scss')
  	.pipe(sass().on('error', sass.logError))
  	.pipe(gulp.dest('static/css/'))
  	.pipe(browserSync.stream());
});

//-------------------
//DEPLOY TASK
gulp.task('deploy', ['build'], function() {
  return gulp.src('build/**/*')
    .pipe(ghPages());
});

//-------------------
//BUILD TASKS
gulp.task('prepare-bower-js', function() {
	var filter = gulpFilter('**/*.js');

	return gulp.src(mainBowerFiles())
		.pipe(filter)
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('build/.tmp/bower'))
    .pipe(concat('bower.js'))
    .pipe(gulp.dest('build/.tmp'));
});

gulp.task('prepare-css', function() {
	gulp.src('static/css/*.css')
		.pipe(gulp.dest('build'));
});

gulp.task('prepare-js', ['prepare-bower-js'],function() {
	return gulp.src('static/scripts/*.js')
    .pipe(uglify().on('error', gutil.log))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build/.tmp'));
});

gulp.task('prepare-bundle', ['prepare-js'],function() {
	return gulp.src(['build/.tmp/bower.js', 'build/.tmp/app.js'])
    .pipe(gulp.dest('build/.tmp/bower'))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('build/'));
});

gulp.task('prepare-html',function() {
	gulp.src('static/index.html')
		.pipe(htmlreplace({
			'js': 'bundle.js',
			'css': 'styles.css'
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('build', ['prepare-bundle', 'prepare-css', 'prepare-html'], function() {
	return gulp.src('build/.tmp', {read: false})
		.pipe(clean());

	console.log("done!");
});
