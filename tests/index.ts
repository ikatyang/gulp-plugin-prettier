import * as fs from 'fs';
import * as path from 'path';
import Vinyl = require('vinyl');
import * as prettier from '../src/index';

jest.mock('fancy-log');
const fixture_dirname = `${__dirname}/../fixtures`;

beforeEach(() => jest.resetAllMocks());

test('unformatted.ts + default', async () => {
  const result = await create_stream('unformatted.ts', undefined, undefined);
  expect(result.formatted).toMatchSnapshot();
});

test('unformatted.js + default', async () => {
  const result = await create_stream(
    'with_config/unformatted.js',
    undefined,
    undefined,
  );

  expect(result.formatted).toMatchSnapshot();
});

test('unformatted.js + trailingComma(none)', async () => {
  const result = await create_stream(
    'with_config/unformatted.js',
    { trailingComma: 'none' },
    undefined,
  );
  expect(result.formatted).toMatchSnapshot();
});

test('unformatted.js + configFile(false)', async () => {
  const result = await create_stream('with_config/unformatted.js', undefined, {
    configFile: false,
  });
  expect(result.formatted).toMatchSnapshot();
});

test('unformatted.js + trailingComma(all) + configFile(false)', async () => {
  const result = await create_stream(
    'with_config/unformatted.js',
    { trailingComma: 'all' },
    { configFile: false },
  );
  expect(result.formatted).toMatchSnapshot();
});

test('unformatted.js + old prettier', async () => {
  const resolve_config = require('prettier').resolveConfig;
  require('prettier').resolveConfig = undefined;

  const result = await create_stream(
    'with_config/unformatted.js',
    { trailingComma: 'none' },
    undefined,
  );
  expect(result.formatted).toMatchSnapshot();

  require('prettier').resolveConfig = resolve_config;
});

test('unformatted.css + default', async () => {
  const result = await create_stream('unformatted.css', undefined, undefined);
  expect(result.formatted).toMatchSnapshot();
});

test('unformatted.ts + trailingComma(all)', async () => {
  const result = await create_stream(
    'unformatted.ts',
    { trailingComma: 'all' },
    undefined,
  );

  expect(result.formatted).toMatchSnapshot();
});

test('formatted.ts + reporter(error)', async () => {
  const result = await create_stream('formatted.ts', undefined, {
    reporter: prettier.Reporter.Error,
  });
  expect(result).toBeDefined();
});

test('unformatted.ts + reporter(warning)', async () => {
  await create_stream('unformatted.ts', undefined, {
    reporter: prettier.Reporter.Warning,
  });
  const log_spy = require('fancy-log');
  const message = log_spy.mock.calls[0][0];
  expect(message).toMatchSnapshot();
});

test('formatted.ts + reporter(custom)', async () => {
  let counter = 0;
  const custom_reporter: prettier.CustomReporter = () => {
    counter++;
  };
  await create_stream('formatted.ts', undefined, {
    reporter: custom_reporter,
  });
  expect(counter).toBe(1);
});

test('formatted.ts + filter(true)', async () => {
  const result = await create_stream('formatted.ts', undefined, {
    filter: true,
  });
  expect(result.counter).toBe(0);
});

test('throw unformatted.ts + reporter(error)', async () => {
  try {
    await create_stream('unformatted.ts', undefined, {
      reporter: prettier.Reporter.Error,
    });
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});

test(`throw unformatted.css + filepath('')`, async () => {
  try {
    await create_stream('unformatted.css', { filepath: '' }, undefined);
  } catch (error) {
    expect(error).toBeTruthy();
  }
});

test('throw unformatted.ts + reporter(unexpected)', async () => {
  try {
    await create_stream('unformatted.ts', undefined, {
      reporter: 'unexpected' as any,
    });
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});

interface TestResult {
  formatted: string | null;
  counter: number;
}

// tslint:disable-next-line promise-function-async
function create_stream(
  fixture_filename: string,
  prettier_options: undefined | prettier.Options,
  plugin_options: undefined | prettier.PluginOptions,
): Promise<TestResult> {
  let counter = 0;
  return new Promise((resolve, reject) => {
    const stream = prettier.format(prettier_options, plugin_options);

    stream.on('data', (file: Vinyl) => {
      if (file.contents !== null) {
        resolve({
          formatted: file.contents.toString(),
          counter: ++counter,
        });
      } else {
        resolve({
          formatted: null,
          counter,
        });
      }
    });
    stream.on('error', reject);

    const fixture_path = path.join(fixture_dirname, fixture_filename);
    stream.end(
      new Vinyl({
        path: fixture_path,
        contents: fs.existsSync(fixture_path)
          ? Buffer.from(fs.readFileSync(fixture_path))
          : null,
      }),
    );
  });
}
