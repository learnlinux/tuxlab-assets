var gulp = require('gulp');
var gutil = require('gulp-util');

var svg2png = require('gulp-svg2png');
var cheerio = require('gulp-cheerio');

var sass = require('gulp-sass');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var runTimestamp = Math.round(Date.now()/1000);

/* Create Light Version of SVGs */
gulp.task('light_svg', function () {
    return gulp.src('icons/svg/*/*.svg')
        .pipe(cheerio({
          run: function ($) {
              $('path').each(function(){
                  $(this).attr('fill','#FFFFFF');
              });
           },
          parserOptions: { xmlMode: true }
        }))
        .pipe(gulp.dest('icons/svg_light'));
});

/** Convert Icons to PNGs (for use in presentations, etc) **/
gulp.task('svg2png_dark', function () {
    return gulp.src('icons/svg/*/*.svg')
        .pipe(svg2png({
            width : 500,
            height: 500
          }))
        .pipe(gulp.dest('icons/png_dark'));
});

gulp.task('svg2png_light', ['light_svg'], function () {
    return gulp.src('icons/svg_light/*/*.svg')
        .pipe(svg2png({
            width : 500,
            height: 500
          }))
        .pipe(gulp.dest('icons/png_light'));
});

/** Create Icon Font **/
gulp.task('iconfont', function(){
  return gulp.src(['icons/svg/*/*.svg'])
     .pipe(iconfontCss({
        fontName: 'tuxlab-icon',
        cssClass: 'tuxicon',
        path: 'fonts/tuxlab-icon/templates/_icons.scss',
        targetPath: 'scss/tuxlab-icons.scss',
        fontPath: '/assets/fonts/tuxlab-icon/'
     }))
    .pipe(iconfont({
      fontName: 'tuxlab-icon', // required
      prependUnicode: false, // recommended option
      formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
      timestamp: runTimestamp, // recommended to get consistent builds when watching files
    }))
    .on('glyphs', function(glyphs, options) {
      // CSS templating, e.g.
      console.log(glyphs, options);
    })
    .pipe(gulp.dest('fonts/tuxlab-icon'));
});

/** Compile Icon Font SCSS **/
gulp.task('iconfont-sass',['iconfont'], function(){
  return gulp.src(['fonts/tuxlab-icon/scss/tuxlab-icons.scss'])
   .pipe(sass().on('error', sass.logError))
   .pipe(gulp.dest('fonts/tuxlab-icon/css'));
});


gulp.task('default', ['iconfont','iconfont-sass','svg2png_dark','svg2png_light']);
