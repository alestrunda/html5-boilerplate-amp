"use strict";

var gulp = require("gulp");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var sass = require("gulp-sass");
var rename = require("gulp-rename");
var comments = require("postcss-discard-comments");
var del = require("del");

var myBundler = require("gulp-my-bundler");

gulp.task("sass", function() {
  return gulp
    .src("src/scss/main.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("css", function() {
  var processors = [autoprefixer(), cssnano(), comments({ removeAll: true })];
  return gulp
    .src("dist/main.min.css")
    .pipe(postcss(processors))
    .pipe(gulp.dest("dist"));
});

gulp.task("html", function() {
  return gulp
    .src("src/*.html")
    .pipe(myBundler({ cssSource: "dist/main.min.css" }))
    .pipe(gulp.dest("dist"));
});

gulp.task("public", function() {
  return gulp.src("public/*").pipe(gulp.dest("dist"));
});

gulp.task("clean", function() {
  return del("dist/**", { force: true });
});

gulp.task("run-css", gulp.series("sass", "css", "html"));

gulp.task("watch:styles", function() {
  gulp.watch(["src/*.html", "src/scss/*.scss"], gulp.parallel("run-css"));
});

//default task
gulp.task("default", gulp.series("clean", "public", "run-css", "watch:styles"));
