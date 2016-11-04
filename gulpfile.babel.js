/**
 * Created by bharatbatra on 10/27/16.
 */
var gulp = require('gulp');
var sourceMaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglifyjs = require('uglify-js');
var minifier = require('gulp-uglify/minifier');
var sass = require('gulp-sass');
var pump = require('pump');
var path = require('path');


var PathsBackend = {
    es6: ['./Backend/src/**/*.js'],
    es5: './Backend/dist',
    json: ['./Backend/src/**/*.json'],
    jsonPublic: './Backend/dist',
    sourceRoot: path.join(__dirname, 'src')
};

gulp.task('BabelBackend', function() {
    return gulp
        .src(PathsBackend.es6)
        .pipe(sourceMaps.init())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(sourceMaps.write('.', { sourceRoot: PathsBackend.sourceRoot }))
        .pipe(gulp.dest(PathsBackend.es5));
});
gulp.task('watchBackend', function() {
    gulp.watch(PathsBackend.es6, ['BabelBackend'])
});

gulp.task('BackendJson', function(){
    return gulp
        .src(PathsBackend.json)
        .pipe(gulp.dest(PathsBackend.jsonPublic));
});

gulp.task('watchBackendJson', function(){
    gulp.watch(PathsBackend.img, ['BackendJson']);
});

gulp.task('watchFrontendImg', function() {
    gulp.watch([PathsFrontEnd.img], ['FrontendImg'])
});

gulp.task('Backend', ['watchBackend', 'BabelBackend', 'watchBackendJson', 'BackendJson']);



var PathsFrontEnd = {
    es6: ['./Frontend/src/js/**/*.js'],
    es5CompressedDirectory: './Frontend/dist/transpiledJS',
    es5Compressed: './Frontend/dist/transpiledJS/index.js',
    jsPublic: './Backend/dist/public/js',

    html: './Frontend/src/index.html',
    publicHtml: './Backend/dist',
    templates: './Frontend/src/templates/*',
    publicTemplates: './Backend/dist/public/templates',

    scss: './Frontend/src/css/index.scss',
    cssPublic: './Backend/dist/public/css',
    css: './Backend/dist/public/index.css',


    libSrc: './Frontend/src/lib/**/*.*',
    libDist: './Backend/dist/public/lib',
    img: './Frontend/src/img/*',
    imgDirectory: './Backend/dist/public/img',
    sourceRoot: path.join(__dirname, './FrontEnd/')
};


gulp.task('BabelFrontend', function() {
    return gulp
        .src(PathsFrontEnd.es6)
        .pipe(sourceMaps.init())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(concat('index.js'))
        .pipe(sourceMaps.write('.', { sourceRoot: PathsFrontEnd.sourceRoot }))
        .pipe(gulp.dest(PathsFrontEnd.es5CompressedDirectory))
});

gulp.task('CompressFrontendJs', function() {
    var options = { mangle: false };
    return pump([
            gulp.src(PathsFrontEnd.es5Compressed),
            minifier(options, uglifyjs),
            gulp.dest(PathsFrontEnd.jsPublic)
        ]
    )
});
gulp.task('FrontendJs', ['BabelFrontend', 'CompressFrontendJs']);
gulp.task('watchFrontendJs', function() {
    gulp.watch([PathsFrontEnd.es6], ['BabelFrontend'])
});
gulp.task('watchBabelFrontend', function() {
    gulp.watch([PathsFrontEnd.es5Compressed], ['CompressFrontendJs'])
});

gulp.task('Frontend', ['watchFrontendJs', 'watchBabelFrontend', 'watchSass',
    'watchFrontendHtml', 'watchFrontendTemplates', 'watchFrontendImg', 'FrontendJs',
    'sass', 'FrontendHtml', 'FrontendTemplates', 'FrontendImg', 'FrontendLib'
]);

gulp.task('sass', function() {
    return gulp
        .src(PathsFrontEnd.scss)
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest(PathsFrontEnd.cssPublic))
});
gulp.task('watchSass', function() {
    gulp.watch([PathsFrontEnd.scss], ['sass'])
});


gulp.task('FrontendHtml', function() {
    return gulp
        .src(PathsFrontEnd.html)
        .pipe(gulp.dest(PathsFrontEnd.publicHtml))
});


gulp.task('watchFrontendHtml', function() {
    gulp.watch([PathsFrontEnd.html], ['FrontendHtml'])
});

gulp.task('FrontendTemplates', function() {
    return gulp
        .src(PathsFrontEnd.templates)
        .pipe(gulp.dest(PathsFrontEnd.publicTemplates));
});



gulp.task('watchFrontendTemplates', function() {
    gulp.watch([PathsFrontEnd.templates], ['FrontendTemplates'])
});

gulp.task('FrontendLib', function() {
    return gulp
        .src(PathsFrontEnd.libSrc)
        .pipe(gulp.dest(PathsFrontEnd.libDist))
});


gulp.task('FrontendImg', function() {
    return gulp
        .src(PathsFrontEnd.img)
        .pipe(gulp.dest(PathsFrontEnd.imgDirectory))
});





gulp.task('default', ['Frontend', 'Backend']);
