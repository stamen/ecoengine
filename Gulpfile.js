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
    hb             = require("gulp-hb"),
    copy           = require("gulp-copy");

// Gulp mix-ins

require("gulp-autopolyfiller");
require("gulp-watch");

var paths = {
  js: "./js/*.js",
  publicJs: "./build/js"
};

//
// Run all default tasks
//
gulp.task("default",function() {
  gulp.start("cleanup");
  gulp.start("lint");
  gulp.start("uglify");
  gulp.start("templates");
  gulp.start("templates:holos");
  gulp.start("static");
});

gulp.task("cleanup",function(cb) {

  run("rm -rf ./build/*", {}).exec();

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
    .src(mainBowerFiles({filter: new RegExp('.js$', 'i')}).concat([paths.js, "./viewJS/**"]))
    .pipe(sourcemaps.init())
    .pipe(concat('ecoengine.js'))
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

gulp.task("static", function() {
  return gulp.src(["./static/**"], {"prefix":1})
  .pipe(copy("./build/"));
});

//
// Build handlebars templates
// and create html files from them in
// the public directory
//
gulp.task("templates", function() {
  gulp
    .src("./templates/*.handlebars")
    .pipe(hb({
      data: "./data/**/*.{js,json}",
      helpers: [
        "./helpers/*.js"
      ],
      partials: [
        "./templates/partials/*.handlebars"
      ]
    }))
    .pipe(rename({extname: ".html"}))
    .pipe(gulp.dest("./build/"));
});

gulp.task("templates:holos", function() {
  gulp
    .src("./templates/*.handlebars")
    .pipe(hb({
      data: ["./data/**/*.{js,json}","./holos/holos-templates.json"],
      helpers: [
        "./helpers/*.js"
      ],
      partials: [
        "./templates/partials/*.handlebars"
      ]
    }))
    .pipe(rename({extname: ".ninja2.html"}))
    .pipe(gulp.dest("./build/"));
});

//
// Serve contents of the public directory
// locally on port :8000
//
gulp.task("webserver", function() {
  gulp
    .src("./build/")
    .pipe(webserver({
      open: false, // unless you want it
      livereload: false, // unless you want it
      directoryListing: false,
      fallback: "index.html",
      host:"0.0.0.0",
      port:8000
    }));
});

//
// Watch directories for changes
//
gulp.task("watch", function() {
  gulp.watch(mainBowerFiles().concat([paths.js, "./viewJS/**"]),["lint", "uglify"]);
  console.log("watching directory:", paths.js);

  gulp.watch("./templates/**", ["templates, templates:holos"]);
  console.log("watching directory:", paths.templates);

  gulp.start("webserver");
});
