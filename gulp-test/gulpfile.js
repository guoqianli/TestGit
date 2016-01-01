/**
 * 组件安装
 * npm install gulp-until gulp imagemin gulp-ruby-sass gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat
 */
//引入gulp及组件
var gulp = require('gulp'),//基础库
    imagemin = require('gulp-imagemin'),//图片压缩
    sass = require('gulp-ruby-sass'),//sass
    minifycss = require('gulp-minify-css'),//css压缩
    jshint = require('gulp-jshint'),//js检查
    uglify = require('gulp-uglify'),//js压缩
    rename = require('gulp-rename'),//重命名
    concat = require('gulp-concat'),//合并文件
    clean = require('gulp-clean'),//清空文件夹
    tinylr = require('tiny-lr'),//livereload
    sever = tinylr(),
    port = 35729,
    livereload = require('gulp-livereload');//服务器控制客户端同步刷新
//html处理
gulp.task('html', function () {
    var htmlSrc = './src/*.html',
        htmlDst = './dist/';
    gulp.src(htmlSrc)
        .pipe(livereload(sever))
        .pipe(gulp.dest(htmlDst))
});
//样式处理
gulp.task('css', function () {
    var cssSrc = './src/scss/*.scss',
        cssDst = './dist/css';
    gulp.src(cssSrc)
        .pipe(sass({style: 'expanded'}))
        .pipe(gulp.dist(cssDst))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(livereload(sever))
        .pipe(gulp.dest(cssDst))
});
//图片处理
gulp.task('images', function () {
    var imgSrc = './src/images/**/*',
        imaDst = './dist/images';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(livereload(sever))
        .pipe(gulp.dest(imaDst))
});
//js处理
gulp.task('js', function () {
    var jsSrc = './src/js/*.js',
        jsDst = './dist/js';
    gulp.src(jsSrc)
        .pipe(jshint('./jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(livereload(sever))
        .pipe(gulp.dest(jsDst));
});
//清空图片，样式，js
gulp.task('clean', function () {
    gulp.src(['./dist/css', './dist/js', './dist/images'], {read: false})
        .pipe(clean());
});
//默认任务 清空图片。样式。js并重建运行语句gulp
gulp.task('default', ['clean'], function () {
    gulp.start('html', 'css', 'images', 'js')
});
//监听任务，运行语句，gulp watch
gulp.task('watch', function () {
    sever.listen(port, function (err) {
        if (err) {
            return console.log(err);
        }
        //监听html
        gulp.watch('./src/*.html', function (event) {
            gulp.run('html');
        });
        //监听CSS
        gulp.watch('./src/scss/*.scss', function () {
            gulp.run('css');
        });
        //监听images
        gulp.watch('./src/images/**/*', function () {
            gulp.run('images');
        });
        //监听js
        gulp.watch('./src/js/*.js', function () {
            gulp.run('js');
        });
    });
});
