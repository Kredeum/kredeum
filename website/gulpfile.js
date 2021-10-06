"use strict";

const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const log = require("fancy-log");
const sourcemaps = require('gulp-sourcemaps');
const util = require('gulp-util');
const gulpif = require('gulp-if');

var config = {
    production: !!util.env.production
};

// Clean assets
function clean() {
    return del(["./assets/"]);
}

function swallow(err) {
    console.log(err.message);
    this.emit('end');
}


// Optimize Images
function images() {
    return gulp
        .src("./src/images/**/*")
        .pipe(newer("./assets/images"))
        .pipe(
          imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
              plugins: [
                {
                  removeViewBox: false,
                  collapseGroups: true
                }
              ]
            })
          ])
        )
        .pipe(gulp.dest("./assets/images"));
}

// CSS task
function css() {
    return gulp
        .src("./src/scss/**/*.scss")
        .pipe(!config.production ? sourcemaps.init() : util.noop())
        .pipe(plumber())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError, swallow))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.', { sourceRoot: 'css-source' }))
        .pipe(gulp.dest("./assets/css/"))
}

function fonts() {
    return gulp
        .src(["./src/fonts/**/*"])
        .pipe(gulp.dest("./assets/fonts/"))
}

// Transpile, concatenate and minify scripts
function scripts() {
    return gulp
        .src(["./src/js/**/*"])
        .pipe(plumber())
        .pipe(!config.production ? uglify().on('error', swallow) : util.noop())
        .pipe(gulp.dest("./assets/js/"))
}

// Watch files
function watchFiles() {
    gulp.watch("./src/scss/**/*", css);
    gulp.watch("./src/js/**/*", gulp.series(scripts));
    gulp.watch("./src/images/**/*", images);
}

const build = gulp.series(clean, gulp.parallel(css, images, scripts), fonts);
const watch = gulp.parallel(watchFiles);

exports.images = images;
exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
