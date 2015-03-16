'use strict';

var gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    mocha      = require('gulp-mocha'),
    jshint     = require('gulp-jshint'),
    gutil      = require('gulp-util'),
    uglify     = require('gulp-uglifyjs'),
    es         = require('event-stream');

gulp.task('build', function () {
    var normal = gulp.src('backbone.dirty.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest('./dist'));

    var min = gulp.src('backbone.dirty.js')
        .pipe(rename('backbone.dirty.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));

    return es.concat(normal, min);
});


gulp.task('test', function() {
  return gulp.src(['spec/*.js'], { read: false })
    .pipe(mocha({ reporter: 'nyan' }))
    .on('error', gutil.log);
});

gulp.task('watch', function() {
    gulp.watch(['backbone.dirty.js', 'spec/**'], ['test']);
});
