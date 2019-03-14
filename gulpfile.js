const gulp = require('gulp');
const del = require('del');
const download = require('gulp-download');
const decompress = require('gulp-decompress');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const zip = require('gulp-zip');

// Paths
const paths = {
    frontend: {
        root: './front-end/',
        all: './front-end/**/*.*',
        src: './front-end/src/',
        dist: './front-end/dist/',
        css: './front-end/src/assets/css/',
        sass: './front-end/src/assets/sass/**.*',
        js: './front-end/src/assets/js/**.js',
        images: './front-end/src/assets/img/**.*'
    }
};

// ===================================================
// Front-end
// ===================================================

// Minify CSS with SASS
function styles() {
    return (
        gulp
            .src(paths.frontend.sass)
            .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'compressed'}))
            .on('error', sass.logError)
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
            }))
            .pipe(sourcemaps.write('./maps'))
            .pipe(gulp.dest(paths.frontend.css))
    );
}
exports.styles = styles

// Minify JavaScript
function scripts() {
    return (
        gulp
            .src(paths.frontend.js, {
                sourcemaps: true
            })
            .pipe(uglify())
            // .pipe(concat('main.min.js'))
            .pipe(gulp.dest(paths.frontend.dist + '/assets/js/'))
    );
}
exports.scripts = scripts

// Minify Images
function images() {
    return (
        gulp
            .src(paths.frontend.src + '/**/*.*')
            .pipe(imagemin())
            .pipe(gulp.dest(paths.frontend.dist))
    )
};
exports.images = images

// Minify HTML 
function html() {
    return (
        gulp
            .src(paths.frontend.src + '/**/*.html')
            .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, minifyCSS: true, minifyJS: true }))
            .pipe(gulp.dest(paths.frontend.dist))
    )
}
exports.html = html

// Live Server
function frontendServer() {
    browserSync.init({
        server: {
            baseDir: paths.frontend.src
        }
    });
    frontendWatch();
}
exports.frontendServer = frontendServer

// Watch
function frontendWatch() {
    gulp.watch(paths.frontend.sass, styles)
    gulp.watch(paths.frontend.all).on('change', browserSync.reload);
}
exports.frontendWatch = frontendWatch

// Build and Deploy
const frontendDeploy = gulp.series(() => del(paths.frontend.dist), styles, images, scripts, html)

// Commands
gulp.task('deploy', frontendDeploy)
gulp.task('default', frontendServer)


// ===================================================
// Global
// ===================================================

// Watch Files
function watch() {
    gulp.watch(paths.frontend.sass, styles)
    gulp.watch(paths.frontend.all, live)
}
exports.watch = watch
