/**
 * �����װ
 * npm install gulp-until gulp imagemin gulp-ruby-sass gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat
 */
//����gulp�����
var gulp = require('gulp'),//������
    imagemin = require('gulp-imagemin'),//ͼƬѹ��
    sass = require('gulp-ruby-sass'),//sass
    minifycss = require('gulp-minify-css'),//cssѹ��
    jshint = require('gulp-jshint'),//js���
    uglify = require('gulp-uglify'),//jsѹ��
    rename = require('gulp-rename'),//������
    concat = require('gulp-concat'),//�ϲ��ļ�
    clean = require('gulp-clean'),//����ļ���
    tinylr = require('tiny-lr'),//livereload
    sever = tinylr(),
    port = 35729,
    livereload = require('gulp-livereload');//���������ƿͻ���ͬ��ˢ��
//html����
gulp.task('html', function () {
    var htmlSrc = './src/*.html',
        htmlDst = './dist/';
    gulp.src(htmlSrc)
        .pipe(livereload(sever))
        .pipe(gulp.dest(htmlDst))
});
//��ʽ����
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
//ͼƬ����
gulp.task('images', function () {
    var imgSrc = './src/images/**/*',
        imaDst = './dist/images';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(livereload(sever))
        .pipe(gulp.dest(imaDst))
});
//js����
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
//���ͼƬ����ʽ��js
gulp.task('clean', function () {
    gulp.src(['./dist/css', './dist/js', './dist/images'], {read: false})
        .pipe(clean());
});
//Ĭ������ ���ͼƬ����ʽ��js���ؽ��������gulp
gulp.task('default', ['clean'], function () {
    gulp.start('html', 'css', 'images', 'js')
});
//��������������䣬gulp watch
gulp.task('watch', function () {
    sever.listen(port, function (err) {
        if (err) {
            return console.log(err);
        }
        //����html
        gulp.watch('./src/*.html', function (event) {
            gulp.run('html');
        });
        //����CSS
        gulp.watch('./src/scss/*.scss', function () {
            gulp.run('css');
        });
        //����images
        gulp.watch('./src/images/**/*', function () {
            gulp.run('images');
        });
        //����js
        gulp.watch('./src/js/*.js', function () {
            gulp.run('js');
        });
    });
});
