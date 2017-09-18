import * as prettier from 'prettier';
import { get_built_in_reporter, CustomReporter, Reporter } from './reporter';
import { create_transform } from './utils/create-transform';

// tslint:disable-next-line:no-unused-variable
import stream = require('stream');

/**
 * See [Prettier Options](https://github.com/prettier/prettier#options)
 */
export type Options = prettier.Options;

export interface PluginOptions {
  /**
   * report the filenames of files that are different from Prettier formatting
   */
  reporter?: Reporter | CustomReporter;
  /**
   * omit formatted files
   */
  filter?: boolean;
}

export function format(
  prettier_options: Options = {},
  { reporter = Reporter.Warning, filter = false }: PluginOptions = {},
) {
  return create_transform(async (text, filename) => {
    const resolved_config = await (typeof prettier.resolveConfig === 'function'
      ? prettier.resolveConfig(filename)
      : Promise.resolve(null));

    const formatted = prettier.format(text, {
      ...resolved_config,
      ...prettier_options,
      filepath:
        prettier_options.filepath !== undefined
          ? prettier_options.filepath
          : filename,
    });

    const different = formatted !== text;

    const custom_reporter =
      typeof reporter === 'function'
        ? reporter
        : get_built_in_reporter(reporter);
    custom_reporter(filename, different);

    return {
      different,
      formatted: !different && filter ? null : formatted,
    };
  });
}
