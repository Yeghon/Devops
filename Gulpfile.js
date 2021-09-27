const gulp = require('gulp');
const runSequence = require('run-sequence'); // Run tasks sequentially
const jsonModify = require('gulp-json-modify');


gulp.task('upversion', function (release) {
  let currentVersion = require('./package.json').version
  console.log(`Current version: ${currentVersion}`)
  let splitVersion = currentVersion.split('.') // Format 1.prod.stage.dev
  let vBump = ''
  let index = 0
  // console.log(process.argv[4])
  switch (release) {
    case 'production':
      vBump = splitVersion[1].split('"')
      index = 1
      break
    case 'staging':
      vBump = splitVersion[2].split('"')
      index = 2
      break
    case 'development':
      vBump = splitVersion[3].split('"')
      index = 3
      break
    default:
      break
  }
  let patch = Number(vBump)
  patch++
  splitVersion[index] = String(patch)
  process.env.VERSION = splitVersion.join('.')
  console.log(`New Version: ${process.env.VERSION}`)
})

gulp.task('saveversion', function () {
return gulp.src(['./package.json'])
    .pipe(jsonModify({
        key: 'version',
        value: process.env.VERSION
    }))
    .pipe(gulp.dest('./'))
})

gulp.task('autoversion', function () {
    runSequence('upversion','saveversion');
})