"use strict";

const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const noop = require("gulp-noop");
const dotenv = require("dotenv");
dotenv.config();

var config = {
  production: process.env.ENVIR == "PROD"
};

// Clean assets
function clean() {
  return del(["./app/assets/"]);
}

function swallow(err) {
  console.log(err.message);
  this.emit("end");
}

// Optimize Images
function images() {
  return gulp
    .src("./src/images/**/*")
    .pipe(newer("./app/assets/images"))
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
    .pipe(gulp.dest("./app/assets/images"));
}

// CSS task
function css() {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(!config.production ? sourcemaps.init() : noop())
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError, swallow))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write(".", { sourceRoot: "css-source" }))
    .pipe(gulp.dest("./app/assets/css/"));
}

function fonts() {
  return gulp
    .src(["./src/fonts/**/*"])
    .pipe(gulp.dest("./app/assets/fonts/"))
    .pipe(gulp.dest("../wordpress/kredeum-nfts/lib/fonts/"));
}

// Transpile, concatenate and minify scripts
function scripts() {
  return gulp
    .src(["./src/js/**/*"])
    .pipe(plumber())
    .pipe(!config.production ? uglify().on("error", swallow) : noop())
    .pipe(gulp.dest("./app/assets/js/"));
}

// Watch files
function watchFiles() {
  gulp.watch("./src/scss/**/*", css);
  gulp.watch("./src/js/**/*", gulp.series(scripts));
}

const build = gulp.series(clean, gulp.parallel(css, images, scripts), fonts);
const watch = gulp.parallel(watchFiles);

exports.images = images;
exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.fonts = fonts;
exports.default = build;
