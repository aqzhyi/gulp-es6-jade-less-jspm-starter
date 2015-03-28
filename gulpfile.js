"use strict";

var del = require("del");
var gulp = require("gulp");
var wiredep = require("wiredep");
var plugins = require("gulp-load-plugins")();

gulp.task("server", serverTask);
gulp.task("clean", cleanTask);
gulp.task("babel", babelTask);
gulp.task("less", lessTask);
gulp.task("jade", jadeTask);

function cleanTask(done) {
  del([
    "index.html",
    "./dist",
  ], done);
}

function watchTask() {
  // NOTE: Re-inject files when added and deleted.
  plugins.watch([
    "./src/**/*.js",
    "./src/**/*.less",
  ], {events: ["add", "unlink"]}, jadeTask);

  // NOTE: Re-inject files when bower changed.
  gulp.watch(["index.jade", "bower.json"], ["jade"]);
  gulp.watch("./src/**/*.js", ["babel"]);
  gulp.watch("./src/**/*.less", ["less"]);
}

function lessTask() {
  return gulp.src("./src/**/*.less")
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest("./dist"))
    .pipe(plugins.connect.reload());
}

function babelTask() {
  return gulp.src("./src/**/*.js")
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.wrap(";(function () {\n<%= contents %>\n})();"))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest("./dist"))
    .pipe(plugins.connect.reload());
}

function jadeTask() {
  var bowerfiles = wiredep();

  return gulp.src("index.jade")
    .pipe(
      plugins.inject(
        gulp.src(bowerfiles.js || [], {read: false}),
        {name: "bower", relative: true}
      )
    )
    .pipe(
      plugins.inject(
        gulp.src(bowerfiles.css || [], {read: false}),
        {name: "bower", relative: true}
      )
    )
    .pipe(
      plugins.inject(
        babelTask(),
        {name: "our", relative: true}
      )
    )
    .pipe(
      plugins.inject(
        lessTask(),
        {name: "our", relative: true}
      )
    )
    .pipe(plugins.jade({pretty: true}))
    .pipe(gulp.dest("."))
    .pipe(plugins.connect.reload());
}

function serverTask() {
  plugins.connect.server({
    port: 3555,
    root: __dirname,
    livereload: {
      port: 33555
    }
  });

  watchTask();
}
