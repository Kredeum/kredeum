"use strict";

const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const noop = require("gulp-noop");

if (!process.env.ENVIR) {
  throw new Error("GULP : ENV variable ENVIR not set!");
}
var production = process.env.ENVIR == "PROD";

// Clean lib
function clean() {
  return del(["web/dapp/**/*"], { force: true });
}

function swallow(err) {
  console.error(err.message);
  this.emit("end");
}

// Optimize Images
function images() {
  return gulp
    .src("src/images/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true,
            },
          ],
        }),
      ])
    )
    .pipe(gulp.dest("web/dapp/assets/images"));
}

// CSS task
function css() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(!production ? sourcemaps.init() : noop())
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError, swallow))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write(".", { sourceRoot: "css-source" }))
    .pipe(gulp.dest("web/dapp/assets/css/"));
}

function fonts() {
  return gulp.src(["src/fonts/**/*"]).pipe(gulp.dest("web/dapp/assets/fonts/"));
}

// Copy html
function htmls() {
  return gulp.src(["src/html/*"]).pipe(gulp.dest("web/dapp"));
}

// Watch files
function watchFiles() {
  gulp.watch("src/scss/**/*", css);
}

const build = gulp.series(clean, gulp.parallel(css, images,   htmls), fonts);
const watch = gulp.parallel(watchFiles);

exports.images = images;
exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.fonts = fonts;
exports.default = build;
