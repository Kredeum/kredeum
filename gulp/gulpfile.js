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

if (process.env.ENVIR === undefined) {
  dotenv.config();
}
if (!process.env.ENVIR) {
  throw new Error("GULP : ENV variable ENVIR not set!");
}
var production = process.env.ENVIR == "PROD";

// Clean assets
function clean() {
  return del(["../web/dapp/", ".../wordpress/plugins/kredeum-nfts/lib/"], { force: true });
}

function swallow(err) {
  console.error(err.message);
  this.emit("end");
}

// Optimize Images
function images() {
  return gulp
    .src("./images/**/*")
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
    .pipe(gulp.dest("../web/dapp/assets/images"))
    .pipe(gulp.dest("../wordpress/plugins/kredeum-nfts/lib/images"));
}

// CSS task
function css() {
  return gulp
    .src("./scss/**/*.scss")
    .pipe(!production ? sourcemaps.init() : noop())
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError, swallow))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write(".", { sourceRoot: "css-source" }))
    .pipe(gulp.dest("../web/dapp/assets/css/"))
    .pipe(gulp.dest("../wordpress/plugins/kredeum-nfts/lib/css/"));
}

function fonts() {
  return gulp.src(["./fonts/**/*"]).pipe(gulp.dest("../web/dapp/assets/fonts/")).pipe(gulp.dest("../wordpress/plugins/kredeum-nfts/lib/fonts/"));
}

// Copy html
function htmls() {
  return gulp.src(["./html/**/*"]).pipe(gulp.dest("../web/dapp"));
}

// Transpile, concatenate and minify scripts
function scripts() {
  return gulp
    .src(["./src/js/**/*"])
    .pipe(plumber())
    .pipe(!production ? uglify().on("error", swallow) : noop())
    .pipe(gulp.dest("../web/dapp/assets/js/"));
}

// Watch files
function watchFiles() {
  gulp.watch("./src/scss/**/*", css);
  gulp.watch("./src/js/**/*", gulp.series(scripts));
}

const build = gulp.series(clean, gulp.parallel(css, images, scripts, htmls), fonts);
const watch = gulp.parallel(watchFiles);

exports.images = images;
exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.fonts = fonts;
exports.default = build;
