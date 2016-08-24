var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var inject = require('gulp-inject');

var bowerFiles = require('main-bower-files');

gulp.task('connect', function() {
    connect.server({
        root: '',
        port: 3000
    });
});

gulp.task('styles', function() {
    gulp.src('./app/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/styles/'))
});

gulp.task('index', function() {
    var target = gulp.src('./app/index.html');
    var sources = gulp.src(['./app/**/*.js', './app/**/*.css'], {
        read: false
    });
    var bowerSources = gulp.src(bowerFiles(), {
        read: false
    });

    return target
        .pipe(inject(sources))
        .pipe(inject(bowerSources, {
            name: 'bower'
        }, {
            relative: true
        }))
        .pipe(gulp.dest(''));
})

gulp.task('watch', function() {
    gulp.watch('app/**/*.js', ['index']);
    gulp.watch('app/**/*.html', ['index']);
    gulp.watch('app//styles/**/*.scss', ['styles']);
});

gulp.task('default', ['styles', 'index', 'connect', 'watch']);
