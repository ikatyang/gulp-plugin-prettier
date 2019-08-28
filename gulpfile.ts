import * as gulp from 'gulp';
import * as prettier_options from 'prettier-config-ikatyang';
import * as prettier from './src/index';

// tslint:disable-next-line:no-var-requires
const sources = require('./tsconfig.json').include;

function format() {
  return gulp
    .src(sources)
    .pipe(prettier.format(prettier_options, { filter: true }))
    .pipe(gulp.dest(file => file.base));
}

function format_check() {
  return gulp
    .src(sources)
    .pipe(
      prettier.format(prettier_options, { reporter: prettier.Reporter.Error }),
    );
}

export { format, format_check };
