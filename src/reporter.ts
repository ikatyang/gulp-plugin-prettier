import * as colors from 'ansi-colors';
import log = require('fancy-log');
import * as path from 'path';

export type CustomReporter = (filename: string, different: boolean) => void;

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
  Warning = 'warning',
}

export function get_built_in_reporter(reporter: Reporter): CustomReporter {
  switch (reporter) {
    // istanbul ignore next
    case Reporter.None:
      return () => {
        // do nothing
      };
    case Reporter.Error:
      return (filename, different) => {
        if (different) {
          throw new Error(create_error_message(filename, false));
        }
      };
    case Reporter.Warning:
      return (filename, different) => {
        if (different) {
          log(create_error_message(filename, true));
        }
      };
    default:
      throw new Error(`Unexpected built-in-reporter '${reporter}'`);
  }
}

function create_error_message(filename: string, colored: boolean) {
  const relative_filename = path.relative(process.cwd(), filename);
  return `File '${
    colored ? colors.cyan(relative_filename) : relative_filename
  }' was not formatted with Prettier`;
}
