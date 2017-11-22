var gulp = require('gulp');

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

var watch = require('gulp-watch');
var eslint = require('gulp-eslint');
//清除不用的目录及文件
var clean = require('gulp-clean');


//转译
gulp.task('build', function () {
    return browserify('./source/app.jsx')
    // .transform(babelify)
    // .transform(babelify,{presets:["react"]})
        .transform(babelify,{presets:["es2015", "react"]})
        .bundle()
        .pipe(source('reactobj.js'))
        .pipe(gulp.dest('./public/'));
});

//语法检查
gulp.task('lint',function () {
    return gulp.src(['./source/**/*.jsx','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Watch Our Files
gulp.task('watch', function() {
    gulp.watch(['source/*.jsx','source/**/*.jsx',
        'source/*.css','source/**/*.css' ], ['lint','build']);
});

//清除相关文件
gulp.task('clean', function() {
    return gulp.src(['./public/reactobj.js'], {read: false})
        .pipe(clean());
});
gulp.task('default', ['watch','clean','build']);
