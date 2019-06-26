var gulp = require("gulp");
var sass = require("gulp-sass");
var connect = require("gulp-connect");
var inject = require("gulp-inject");
var series = require("stream-series");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var gulpNgConfig = require("gulp-ng-config");
var ngAnnotate = require("gulp-ng-annotate", {
  remove: false,
  add: true,
  single_quotes: true
});
var bowerFiles = require("main-bower-files");


gulp.task("config", function() {
    return gulp
      .src("config.json")
      .pipe(
        gulpNgConfig("enviroCar", {
          createModule: false,
          constants: {
            ecBaseUrl: process.env.EC_BASE_URL,
            ecBase: process.env.EC_BASE,
            ecWebsiteBase: process.env.EC_WEBSITE_BASE,
            ecServerBase: process.env.EC_SERVER_BASE
          }
        })
      )
      .pipe(gulp.dest("app"));
  });

gulp.task(
    "ngAnnotate",
    gulp.series("config", function() {
      return gulp
        .src(["./app/**/*.js"])
        .pipe(concat("release.js"))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest("."));
    })
  );
  

gulp.task("connect", function() {
  return connect.server({ root: "", port: 4014 });
});

gulp.task("styles", function() {
  return gulp
    .src("./app/styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./app/styles/"));
});

gulp.task("index", function() {
  var target = gulp.src("./app/index.html");
  var sources = gulp.src(["./app/**/*.js", "./app/**/*.css"], { read: false });
  var bowerSources = gulp.src(bowerFiles(), { read: false });

  var othersBowerSources = gulp.src([
    "bower_components/angular/angular.min.js",
    "bower_components/material-angular-paging/build/dist.min.js"
  ]);

  return target
    .pipe(inject(series(othersBowerSources, sources), { addRootSlash: false }))
    .pipe(
      inject(
        bowerSources,
        {
          name: "bower",
          addRootSlash: false
        },
        { relative: true }
      )
    )
    .pipe(gulp.dest("."));
});

gulp.task(
  "index-release",
  gulp.series("styles", "ngAnnotate", function() {
    var target = gulp.src("./app/index.html");
    var sources = gulp.src(["release.js", "./app/**/*.css"], { read: false });
    var bowerSources = gulp.src(bowerFiles(), { read: false });

    var othersBowerSources = gulp.src([
      "bower_components/angular/angular.min.js",
      "bower_components/material-angular-paging/build/dist.min.js"
    ]);

    return target
      .pipe(
        inject(series(othersBowerSources, sources), { addRootSlash: false })
      )
      .pipe(
        inject(
          bowerSources,
          {
            name: "bower",
            addRootSlash: false
          },
          { relative: true }
        )
      )
      .pipe(gulp.dest("."));
  })
);

gulp.task("minify", function() {
  return gulp
    .src(["app/**/*.js"])
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(gulp.dest("."));
});

gulp.task("watch", function() {
  gulp.watch("app/**/*.js", ["index"]);
  gulp.watch("app/**/*.html", ["index"]);
  gulp.watch("app//styles/**/*.scss", ["styles"]);
});


gulp.task("default", gulp.series("styles", "index", "connect", "watch"));

gulp.task(
  "release",
  gulp.series("config", "styles", "ngAnnotate", "index-release")
);
