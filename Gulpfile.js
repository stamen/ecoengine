"use strict";

var fs = require("fs");

var copy           = require("gulp-copy"),
    gulp           = require("gulp"),
    jshint         = require("gulp-jshint"),
    rename         = require("gulp-rename"),
    replace        = require("gulp-replace"),
    run            = require("gulp-run"),
    sourcemaps     = require("gulp-sourcemaps"),
    uglify         = require("gulp-uglify"),
    env            = require('gulp-env'),
    webserver      = require("gulp-webserver"),
    concat         = require('gulp-concat'),
    mainBowerFiles = require('main-bower-files'),
    wrap           = require("gulp-wrap"),
    copy           = require("gulp-copy");

// Gulp mix-ins

require("gulp-autopolyfiller");
require("gulp-watch");

var paths = {
  js: "./js/*.js",
  publicJs: "./static/js/stamen"
};

//
// Run all default tasks
//
gulp.task("default",function() {
  gulp.start("lint");
  gulp.start("uglify");
});

//
// Check quality of Javascript
// warn if errors or style problems are found
//
gulp.task("lint", function() {
  gulp
    .src(paths.js)
    .pipe(jshint({
      predef: [
        "document",
        "location",
        "navigator",
        "window",
        "L"
      ],
      expr: true
    }))
    .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("uglify", function() {
  gulp
    .src(mainBowerFiles("**/*.js").concat([paths.js]))
    .pipe(sourcemaps.init())
    .pipe(concat('ecoengine-dependencies.js'))
    .pipe(gulp.dest(paths.publicJs))
    .pipe(uglify({
      mangle: true,
      output: {
        beautify: false
      }
    }))
    .pipe(rename({extname: ".min.js"}))
    .pipe(sourcemaps.write("./")) // Write a sourcemap for browser debugging
    .pipe(gulp.dest(paths.publicJs));
});

gulp.task("dist", function() {
  return gulp.src(["./static/**","./explore/**","./prototypes/**"], {"prefix":1})
  .pipe(copy("./build/"));
});

gulp.task("dist:holos", function() {
  return gulp.src(["./static/**","./explore/**","./holosinit/**"], {"prefix":1})
  .pipe(copy("./build/"));
});

//
// Serve contents of the public directory
// locally on port :8080
//
gulp.task("webserver", function() {
  gulp
    .src("./")
    .pipe(webserver({
      open: false, // unless you want it
      livereload: false, // unless you want it
      directoryListing: false,
      fallback: "explore/index.html"
    }));
});

//
// Watch directories for changes
//
gulp.task("watch", function() {
  gulp.watch(mainBowerFiles().concat([paths.js]),["lint", "uglify"]);
  console.log("watching directory:", paths.js);

  gulp.start("webserver");
});
