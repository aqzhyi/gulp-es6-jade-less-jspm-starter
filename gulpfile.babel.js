import del from 'del'
import gulp from 'gulp'
import gulpplugins from 'gulp-load-plugins'
import runsequence from 'run-sequence'

let gulpRun = runsequence.use(gulp)
let plugins = gulpplugins()

gulp.task('babel', babelTask)
gulp.task('clean', cleanTask)
gulp.task('less', lessTask)
gulp.task('watch', watchTask)

function cleanTask(done) {
  del('./dist', done)
}

function watchTask() {
  let events = ['add', 'unlink', 'change']

  gulpRun('clean', ['babel', 'less'])

  plugins.watch('./src/**/*.js', {events}, (file) => {
    gulpRun('babel')
  })
  plugins.watch('./src/**/*.less', {events}, () => {
    gulpRun('less')
  })
}

function lessTask() {
  return gulp.src('./src/**/*.less')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./dist'))
    .pipe(plugins.connect.reload())
}

function babelTask() {
  return gulp.src('./src/**/*.js')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({ modules: 'umd' }))
    .pipe(plugins.wrap('(function () {\n<%= contents %>\n})()'))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./dist'))
    .pipe(plugins.connect.reload())
}
