import gulp from "gulp";
import imagemin , {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';

import autoprefixer from "autoprefixer";
import plumber from "gulp-plumber";
import cssnano from "cssnano";
import postcss from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import noop from "gulp-noop";

import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

if (!process.env.ENVIR) {
  throw new Error("GULP : ENV variable ENVIR not set!");
}
var production = process.env.ENVIR == "PROD";


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
        gifsicle({ interlaced: true }),
        mozjpeg({ progressive: true }),
        optipng({ optimizationLevel: 5 }),
        svgo({
          plugins: [
            {
              name: 'removeViewBox',
              active: false
            },
            {
              name: 'collapseGroups',
              active: true
            }
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


const build = gulp.series(gulp.parallel(css, images, htmls), fonts);

export default build;
