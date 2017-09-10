import * as gulp_util from 'gulp-util';
import through = require('through2');

// tslint:disable-next-line:no-unused-variable
import stream = require('stream');

// tslint:disable-next-line:no-var-requires
const package_name = require('../../package.json').name;

export type Transformer = (text: string, filename: string) => TransformResult;
export interface TransformResult {
  formatted: string | null;
  different: boolean;
}

export function create_transform(transformer: Transformer) {
  return through.obj(
    (input_file: gulp_util.File, _encoding: string, callback) => {
      // istanbul ignore next
      if (input_file.isNull()) {
        callback(null, input_file);
        return;
      }
      // istanbul ignore next
      if (!input_file.isBuffer()) {
        callback(
          new gulp_util.PluginError(package_name, `Support Buffer only`),
        );
        return;
      }
      const output_file: gulp_util.File = input_file.clone();
      try {
        const text = input_file.contents.toString('utf8');
        const { formatted, different } = transformer(text, input_file.path);
        if (formatted === null) {
          output_file.contents = null;
        } else if (different) {
          output_file.contents = new Buffer(formatted);
        }
        callback(null, output_file);
      } catch (e) {
        const error = e as Error;
        callback(new gulp_util.PluginError(package_name, error.message));
      }
    },
  );
}
