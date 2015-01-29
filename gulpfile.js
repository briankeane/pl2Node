var gulp = require('gulp');

// require everything in /gulp folder
var fs = require('fs');
fs.readdirSync(__dirname + '/gulp').forEach(function (task) {
  require ('./gulp/' + task);
});

gulp.task('dev', ['watch:js', 'watch:css', 'dev:server'])