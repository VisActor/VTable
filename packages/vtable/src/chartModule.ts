/* eslint-disable sort-imports */
import { extend } from './tools/helper';
export const chartTypes: { [key: string]: any } = {};
const builtin = {};
export function get(): { [key: string]: any } {
  return extend(builtin, chartTypes);
}
