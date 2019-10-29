var gulp = require("gulp");
var sass = require("gulp-sass");
var cssmin = require("gulp-cssmin");
var connect = require("gulp-connect");
var inject = require("gulp-inject");
var series = require("stream-series");
var uglify = require("gulp-uglify");
var filter = require("gulp-filter");
var debug = require("gulp-debug");
var concat = require("gulp-concat");
var gulpNgConfig = require("gulp-ng-config");
var ngAnnotate = require("gulp-ng-annotate", {
  remove: false,
  add: true,
  single_quotes: true
});
var bowerFiles = require("main-bower-files");
var bowerOptions = {
  overrides: {
    "material-angular-paging": {
      main: "lib/**/*.js"
    }
  }
};

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
    .pipe(gulp.dest("dist"));
});

gulp.task("manifest", function() {
  return gulp.src("app/config/manifest.json").pipe(gulp.dest("dist"));
});

gulp.task(
  "ngAnnotate",
  gulp.series("config", function() {
    var withoutConfig = filter(["**", "!dist/config.js"], { restore: true });
    return gulp
      .src(["app/**/*.js", "dist/config.js"])
      .pipe(debug({ title: "ngAnnotate: " }))
      .pipe(ngAnnotate())
      .pipe(withoutConfig)
      .pipe(uglify())
      .pipe(concat("app.js"))
      .pipe(withoutConfig.restore)
      .pipe(gulp.dest("dist"));
  })
);

gulp.task("connect", function() {
  return connect.server({ root: "", port: 4014 });
});

gulp.task("styles", function() {
  return gulp
    .src("app/styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cssmin())
    .pipe(gulp.dest("dist"));
});

gulp.task("templates", function() {
  return gulp
    .src("app/components/**/*.html")
    .pipe(debug({ title: "templates: " }))
    .pipe(gulp.dest("dist/app/components"));
});

gulp.task("images", function() {
  return gulp
    .src(["app/**/*.png", "app/**/*.jpg"])
    .pipe(debug({ title: "images: " }))
    .pipe(gulp.dest("dist/app"));
});

gulp.task("assets", gulp.parallel("images", "templates"));

gulp.task("styles-min", function() {
  return gulp
    .src("./app/styles/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(debug({ title: "styles: " }))
    .pipe(cssmin())
    .pipe(gulp.dest("dist"));
});

gulp.task("index", gulp.series("assets"), function() {
  return gulp
    .src("./app/index.html")
    .pipe(
      inject(gulp.src(["./app/**/*.js", "./app/**/*.css"], { read: false }), {
        relative: true,
        ignorePath: "dist/",
        addPrefix: "../app"
      })
    )
    .pipe(
      inject(
        series(
          gulp.src(bowerFiles(bowerOptions), { read: false }),
          gulp.src(["bower_components/angular/angular.min.js"], { read: false })
        ),
        {
          name: "vendor",
          relative: true,
          ignorePath: "dist/",
          addPrefix: ".."
        }
      )
    )
    .pipe(gulp.dest("./dist"));
});

gulp.task("vendor-js", function() {
  return gulp
    .src(bowerFiles(bowerOptions))
    .pipe(filter("**/*.js"))
    .pipe(debug({ title: "vendor-js: " }))
    .pipe(concat("vendor.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});

gulp.task("vendor-css", function() {
  return gulp
    .src(bowerFiles(bowerOptions))
    .pipe(filter("**/*.css"))
    .pipe(debug({ title: "vendor-css: " }))
    .pipe(concat("vendor.css"))
    .pipe(cssmin())
    .pipe(gulp.dest("dist"));
});

gulp.task("vendor", gulp.parallel("vendor-css", "vendor-js"));

gulp.task("index-release", function() {
  return gulp
    .src("app/index.html")
    .pipe(
      inject(
        gulp
          .src(
            [
              "dist/vendor.js",
              "dist/app.js",
              "dist/config.js",
              "dist/**/*.css"
            ],
            { read: false }
          )
          .pipe(debug({ title: "inject: " })),
        {
          addRootSlash: false,
          relative: true,
          ignorePath: "../dist/"
        }
      )
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("watch", function() {
  gulp.watch("app/**/*.js", ["index"]);
  gulp.watch("app/**/*.html", ["index"]);
  gulp.watch("app/**/*.scss", ["styles"]);
});

gulp.task(
  "default",
  gulp.series("config", "styles", "manifest", "index", "connect", "watch")
);

gulp.task(
  "release",
  gulp.series(
    "styles-min",
    "vendor",
    "ngAnnotate",
    "assets",
    "manifest",
    "index-release"
  )
);
