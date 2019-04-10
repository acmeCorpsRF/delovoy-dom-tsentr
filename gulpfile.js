const {series, parallel, src, dest, watch, task} = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat-css'),
    minify = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

task('transformationSass', function () {
    return src(['public/sass/*.scss'])
        .pipe(sass({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(dest('public/css/other/'));
});

task('transformationCss', function () {
    return src(['public/css/other/other.css', 'public/css/other/media-another.css', 'public/css/other/media-960.css', 'public/css/other/media-660.css', 'public/css/other/media-320.css'])
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ["last 5 version", "> 1%"],
            cascade: false
        }))
        .pipe(dest('public/css/'))
        .pipe(minify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('public/css/'));
});

task('watch', function () {
    watch('public/sass/*.scss', series('transformationSass', 'transformationCss'));
});

task('serve', function () {
    browserSync.init({
        server: 'public/',
        index: 'index.html',
        notify: false
    });
    browserSync.watch('public/index.html').on('change', browserSync.reload);
    browserSync.watch('public/css/style.min.css').on('change', browserSync.reload)
});

task('default',
    series('transformationSass', 'transformationCss', parallel('watch', 'serve'))
);
