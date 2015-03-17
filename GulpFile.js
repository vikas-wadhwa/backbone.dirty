'use strict';

var gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    jshint     = require('gulp-jshint'),
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
