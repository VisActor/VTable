/* eslint-disable sort-imports */
import { extend } from './tools/helper';
import { chartTypes as plugins } from './plugins/chartTypes';
const builtin = {};
export function get(): { [key: string]: any } {
  return extend(builtin, plugins);
}
