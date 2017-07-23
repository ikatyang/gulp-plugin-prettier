# gulp-plugin-prettier

[![npm](https://img.shields.io/npm/v/gulp-plugin-prettier.svg)](https://www.npmjs.com/package/gulp-plugin-prettier)
[![build](https://img.shields.io/travis/ikatyang/gulp-plugin-prettier/master.svg)](https://travis-ci.org/ikatyang/gulp-plugin-prettier/builds)
[![coverage](https://img.shields.io/codecov/c/github/ikatyang/gulp-plugin-prettier/master.svg)](https://codecov.io/gh/ikatyang/gulp-plugin-prettier)

Gulp plugin to format code with [Prettier](https://github.com/prettier/prettier)

[Changelog](https://github.com/ikatyang/gulp-plugin-prettier/blob/master/CHANGELOG.md)

## Install

```sh
# using npm
npm install --save-dev gulp-plugin-prettier gulp prettier

# using yarn
yarn add --dev gulp-plugin-prettier gulp prettier
```

**NOTE**: For TypeScript user, you have to install `@types/prettier` to get full types.

## Usage

(gulpfile.ts)

```ts
import * as gulp from 'gulp';
import * as prettier from 'gulp-plugin-prettier';

// replace unformatted with formatted
gulp.task('format', () =>
  gulp.src(['./src/**/*.ts', './gulpfile.ts'])
    .pipe(prettier.format({ singleQuote: true }))
    .pipe(gulp.dest(file => file.base)),
);

// throw error if there is unformatted file
gulp.task('format-check', () =>
  gulp.src(['./src/**/*.ts', './gulpfile.ts'])
    .pipe(
      prettier.format({ singleQuote: true }, { reporter: prettier.Reporter.Error }),
    ),
);
```

(gulpfile.js)

```ts
const gulp = require('gulp');
const prettier = require('gulp-plugin-prettier');

// replace unformatted with formatted
gulp.task('format', () =>
  gulp.src(['./src/**/*.js', './gulpfile.js'])
    .pipe(prettier.format({ singleQuote: true }))
    .pipe(gulp.dest(file => file.base))
);

// throw error if there is unformatted file
gulp.task('format-check', () =>
  gulp.src(['./src/**/*.js', './gulpfile.js'])
    .pipe(prettier.format({ singleQuote: true }, { reporter: 'error' }))
);
```

## API

[Prettier Options](https://github.com/prettier/prettier#options)

```ts
export function format(prettier_options?: PrettierOptions, plugin_options?: PluginOptions): stream.Transform;

export interface PluginOptions {
  /**
   * default: 'warning'
   * report the filenames of files that are different from Prettier formatting
   */
  reporter?: Reporter | CustomReporter;
  /**
   * default: false
   * omit formatted files
   */
  filter?: boolean;
}

export const enum Reporter {
  /**
   * do nothing
   */
  None = 'none',
  /**
   * throw error for the filenames of files that are different from Prettier formatting
   */
  Error = 'error',
  /**
   * print warning for the filenames of files that are different from Prettier formatting
   */
  Warning = 'warning'
}

export type CustomReporter = (filename: string, different: boolean) => void;
```

## Development

```sh
# lint
yarn run lint

# format
yarn run format

# build
yarn run build

# test
yarn run test
```

## Related

- [gulp-prettier](https://github.com/bhargavrpatel/gulp-prettier)
- [gulp-nf-prettier](https://github.com/btholt/gulp-nf-prettier)
- [gulp-prettier-plugin](https://github.com/GAumala/gulp-prettier-plugin)
- [@bdchauvette/gulp-prettier](https://github.com/bdchauvette/gulp-prettier)

## License

MIT © [Ika](https://github.com/ikatyang)
