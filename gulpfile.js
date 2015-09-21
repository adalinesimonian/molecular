/* global process */

var gulp = require('gulp')
var path = require('path')
var watch = require('gulp-watch')
var babel = require('gulp-babel')
var plumber = require('gulp-plumber')
var through = require('through2')

var libDir = 'lib/'
var srcDir = 'src/**/*.es6'

function handleBabelError (err) {
  console.log(
    err.message.replace(process.cwd(), '').replace(/^(\/|\\)/, '')
  )
  err.codeFrame && console.log(err.codeFrame)
}

function logBabelOutput () {
  return through.obj(function (file, enc, cb) {
    var filePath = path.relative(file.cwd, file.history[0])
    console.log('Processed ' + filePath)
    cb(null, file)
  })
}

function runBabel (stream) {
  return stream
    .pipe(plumber(handleBabelError))
    .pipe(babel())
    .pipe(plumber.stop())
    .pipe(gulp.dest(libDir))
    .pipe(logBabelOutput())
}

gulp.task('babel', () => runBabel(gulp.src(srcDir)))
gulp.task('babel-watch', () => runBabel(gulp.src(srcDir).pipe(watch(srcDir))))
