'use strict';

const watchify    = require('watchify');
const babelify    = require('babelify');
const browserify  = require('browserify');
const gulp        = require('gulp');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const gutil       = require('gulp-util');
const uglify      = require('gulp-uglify');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const imagemin    = require('gulp-imagemin');
const pngquant    = require('imagemin-pngquant');
const del         = require('del');
const htmlmin     = require('gulp-htmlmin');
const plumber     = require('gulp-plumber');
const cleanCSS    = require('gulp-clean-css');
const docco       = require("gulp-docco");


// add options to babelify
var options             = watchify.args;
    options.entries     = 'src/assets/js/bundle.js';
    options.extensions  = ['.js'];

    // prepare browserify object
    var w = watchify(browserify(options)).transform(babelify.configure({
            presets: ['react', 'es2015', 'stage-0'],
            ignore: /(bower_components)|(node_modules)/,
            plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy',   ['transform-es2015-classes', {loose: true}]]
        }));
        w.on('update', bundle);
        w.on('log', gutil.log);


// builder function
function bundle() {
    w.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('dist/assets/js/bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(''));
        browserSync.reload();
        return;
}

// task and listeners
gulp.task('browserify', bundle);


/**
 * This task removes all files inside the 'dist' directory.
 */
gulp.task('clean', () =>
{
    del.sync('./dist/**/*');
});


/**
 * This task starts browserSync. Allowing refreshes to be called from the gulp
 * bundle task.
 */
gulp.task('browser-sync', () =>
{

    return browserSync({ server:  { baseDir: './dist' } });

});

/**
 * This task will remove all unecessary CSS lines
 */
 gulp.task('fonts', () => {
     return gulp.src('./src/assets/fonts/**')
         .pipe(gulp.dest('./dist/assets/fonts/'));
 });
 /**
 * This task will copy index.html into 'dist'.
 * If you want to process it, just add your code to this task.
 */
gulp.task('html', () =>
{
    return gulp.src(['./src/*.html'])
        .pipe(plumber())
        //.pipe(validator())
        .pipe(htmlmin())
        .pipe(gulp.dest('./dist/'));
});
 /**
  * This task will copy all files from libs into 'dist/img'.
  * If you want to process them, just add your code to this task.
  */
 gulp.task('img', () =>
 {
     return gulp.src(['./src/assets/images/**'])
         .pipe(plumber())
        /* .pipe(imagemin({
     			progressive: true,
     			svgoPlugins: [{removeViewBox: false}],
     			use: [pngquant()]
     		}))
*/         .pipe(gulp.dest('./dist/assets/images'))
 });

 /**
 * Generate documentation
 */
 gulp.task('documentation', () =>
 {
   return gulp.src(["./src/assets/js/**/*.js"])
    .pipe(wrapDocco({src: 'template.html'}))
    .pipe(gulp.dest('./dist/documentation'))
 });
 /**
 * This task will copy all files from libs into 'dist/css'.
 * If you want to process them, just add your code to this task.
 */
gulp.task('css', () =>
{
    return gulp.src(['./src/assets/css/**'])
        .pipe(plumber())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist/assets/css'))
});


gulp.task('default', (callback)=> {
  runSequence('clean', 'html', 'css', 'fonts', 'img', 'browserify', 'browser-sync');
});

gulp.task('documentation', (callback)=> {
  runSequence('documentation');
});
