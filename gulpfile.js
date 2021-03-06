// Assigning modules to local variables
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var clean = require('gulp-clean');


// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

var filesToMove = [
    './app/css/*.*',
    './app/img/**/*.*',
    './app/js/*.*',
    './app/vendor/**/**/*.*',
    './app/font-awesome/**/*.*',
    './app/jquery/*.*',
    './app/magnific-popup/*.*',
    './app/scrollreveal/*.*',
    '/app/index.html'
];


// Default task
gulp.task('default', ['less', 'minify-css', 'minify-js']);

// Less task to compile the less files and add the banner
gulp.task('less', function() {
    return gulp.src('app/less/*.*')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/less'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify CSS
gulp.task('minify-css', function() {
    return gulp.src('app/css/*')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('app/js/*')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('bootstrap', function() {
    return gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('dist/vendor/bootstrap'))
});

// Copy jQuery core files from node_modules to vendor directory
gulp.task('jquery', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('dist/vendor/jquery'))
});

// Copy Magnific Popup core files from node_modules to vendor directory
gulp.task('magnific-popup', function() {
    return gulp.src(['node_modules/magnific-popup/dist/*'])
        .pipe(gulp.dest('dist/vendor/magnific-popup'))
});

// Copy ScrollReveal JS core JavaScript files from node_modules
gulp.task('scrollreveal', function() {
    return gulp.src(['node_modules/scrollreveal/dist/*.js'])
        .pipe(gulp.dest('dist/vendor/scrollreveal'))
});

// Copy Font Awesome core files from node_modules to vendor directory
gulp.task('fontawesome', function() {
    return gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('dist/vendor/font-awesome'))
});

// Copy all dependencies from node_modules
gulp.task('copy', ['bootstrap', 'jquery', 'fontawesome', 'magnific-popup', 'scrollreveal']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: './app/'
        }
    })
});

// Copy over index.html
gulp.task('copy', function () {
    return gulp
        .src('./app/index.html')
    .pipe(gulp.dest('dist'));
});

// gulp.task('copy',['clean'], function(){
//     // the base option sets the relative root for the set of files,
//     // preserving the folder structure
//     gulp.src(filesToMove, { base: './app' })
//         .pipe(gulp.dest('dist'));
// });

gulp.task('copy',['clean'], function(){
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    gulp.src(filesToMove, { base: './app' })
        .pipe(gulp.dest('dist'));
});

// Watch Task that compiles LESS and watches for HTML or JS changes and reloads with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js', 'copy', 'clean'], function() {
    gulp.watch('app/less/*.less', ['less']);
    gulp.watch('app/index.html', ['copy']);
    gulp.watch('app/css/*.css', ['minify-css']);
    gulp.watch('app/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});
