import gulp from 'gulp';
import webpack from 'webpack-stream';
import configs from './build/webpack.configs';
import mocha from 'gulp-spawn-mocha';
import gutil from 'gulp-util';

const root = __dirname;

function registerWebpackGulpTask(name, {watch = false, entry, dest}) {
    gulp.task(name, () => {
        return gulp.src(entry)
            .pipe(webpack(configs.server({root, watch})))
            .on('error', gutil.log)
            .pipe(gulp.dest(dest));
    });
}

registerWebpackGulpTask('build:server', {
    entry: 'src/entries/server.js',
    dest: 'dist/'
});

registerWebpackGulpTask('build:spec', {
    entry: 'src/entries/spec.js',
    dest: 'dist/spec/'
});

registerWebpackGulpTask('build:server:watch', {
    watch: true,
    entry: 'src/entries/server.js',
    dest: 'dist/'
});

registerWebpackGulpTask('build:spec:watch', {
    watch: true,
    entry: 'src/entries/spec.js',
    dest: 'dist/spec/'
});

gulp.task('test', () => {
    return gulp.src('dist/spec/main.js', {read: false})
        .pipe(mocha({reporter: 'min'}))
        .on('error', gutil.log);
});

gulp.task('test:watch', ['test'], () => {
    gulp.watch('dist/spec/main.js', ['test']);
});

gulp.task('build', ['build:spec', 'build:server']);

gulp.task('default', ['build:spec:watch', 'test:watch']);

//     "start": "npm run start:development",
//     "stop": "npm run stop:development",
//     "start:development": "npm run build && NODE_ENV=development pm2 start pm2.json && pm2 logs",
//     "stop:development": "pm2 delete pm2.json",
//     "start:production": "npm run build && NODE_ENV=production pm2 start pm2.json",
//     "stop:production": "pm2 delete pm2.json",
