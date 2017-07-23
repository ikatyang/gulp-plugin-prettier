import * as gulp from 'gulp';
import * as gulp_util from 'gulp-util';
import * as prettier from '../src/index';
import { create_transform } from '../src/utils/create-transform';

const log_spy = jest.spyOn(gulp_util, 'log');
const fixture_dirname = `${__dirname}/../fixtures`;

beforeEach(() => jest.resetAllMocks());

test('unformatted.ts + default', done => {
  const task = create_task('unformatted.ts', undefined, undefined);
  gulp.start(task.name, () => {
    expect(task.result.formatted).toMatchSnapshot();
    done();
  });
});

test('unformatted.css + default', done => {
  const task = create_task('unformatted.css', undefined, undefined);
  gulp.start(task.name, () => {
    expect(task.result.formatted).toMatchSnapshot();
    done();
  });
});

test('unformatted.ts + trailingComma(all)', done => {
  const task = create_task(
    'unformatted.ts',
    { trailingComma: 'all' },
    undefined,
  );
  gulp.start(task.name, () => {
    expect(task.result.formatted).toMatchSnapshot();
    done();
  });
});

test('formatted.ts + reporter(error)', done => {
  const task = create_task('formatted.ts', undefined, {
    reporter: prettier.Reporter.Error,
  });
  gulp.start(task.name, () => {
    expect(task.result.error).toBeFalsy();
    done();
  });
});

test('unformatted.ts + reporter(warning)', done => {
  const task = create_task('unformatted.ts', undefined, {
    reporter: prettier.Reporter.Warning,
  });
  gulp.start(task.name, () => {
    const message = log_spy.mock.calls[0][0];
    expect(message).toMatchSnapshot();
    done();
  });
});

test('formatted.ts + reporter(custom)', done => {
  let counter = 0;
  const custom_reporter: prettier.CustomReporter = () => {
    counter++;
  };
  const task = create_task('formatted.ts', undefined, {
    reporter: custom_reporter,
  });
  gulp.start(task.name, () => {
    expect(counter).toBe(1);
    done();
  });
});

test('formatted.ts + filter(true)', done => {
  const task = create_task('formatted.ts', undefined, { filter: true });
  gulp.start(task.name, () => {
    expect(task.result.counter).toBe(0);
    done();
  });
});

test('throw unformatted.ts + reporter(error)', done => {
  const task = create_task(
    'unformatted.ts',
    undefined,
    { reporter: prettier.Reporter.Error },
    false,
  );
  gulp.start(task.name, error => {
    expect(error).toMatchSnapshot();
    done();
  });
});

test(`throw unformatted.css + filepath('')`, done => {
  const task = create_task(
    'unformatted.css',
    { filepath: '' },
    undefined,
    false,
  );
  gulp.start(task.name, error => {
    expect(error).toBeTruthy();
    done();
  });
});

test('throw unformatted.ts + reporter(unexpected)', done => {
  const task = create_task(
    'unformatted.ts',
    undefined,
    { reporter: 'unexpected' as any },
    false,
  );
  gulp.start(task.name, error => {
    expect(error).toMatchSnapshot();
    done();
  });
});

let task_counter = 0;
function create_task(
  fixture_filename: string,
  prettier_options: undefined | prettier.Options,
  plugin_options: undefined | prettier.PluginOptions,
  catch_result: boolean = true,
) {
  const name = `task-${++task_counter}`;
  const result: {
    formatted?: string;
    error?: Error;
    counter: number;
  } = {
    counter: 0,
  };
  gulp.task(name, () => {
    const stream = gulp
      .src(`${fixture_dirname}/${fixture_filename}`)
      .pipe(prettier.format(prettier_options, plugin_options));
    return !catch_result
      ? stream
      : stream.pipe(
          create_transform(text => {
            result.counter++;
            result.formatted = text;
            return { formatted: text, different: false };
          }),
        );
  });
  return { name, result };
}
