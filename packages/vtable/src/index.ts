/* eslint-disable sort-imports */

// export { version } from '../../package.json';
import * as TYPES from './ts-types';
import * as core from './core';
import * as data from './data';
import * as icons from './icons';
import * as register from './register';
import * as themes from './themes';
import * as DataStatistics from './dataset/DataStatistics';
import type {
  ColumnDefine,
  ColumnsDefine,
  LinkColumnDefine,
  ChartColumnDefine,
  ImageColumnDefine,
  SparklineColumnDefine,
  ProgressbarColumnDefine,
  TextColumnDefine,
  GroupColumnDefine,
  ListTableConstructorOptions,
  PivotTableConstructorOptions,
  IHeaderTreeDefine,
  IDimension,
  IIndicatorCustom
} from './ts-types';
import { ListTable } from './ListTable';
import { PivotTable } from './PivotTable';
import type { MousePointerCellEvent } from './ts-types/events';
import * as CustomLayout from './render/layout';
export const version = __VERSION__;
/**
 * @namespace VTable
 */
export {
  /**
   * Types
   * @namespace VTable.TYPES
   */
  TYPES,
  core,
  ListTable,
  ListTableConstructorOptions,
  PivotTable,
  PivotTableConstructorOptions,
  IHeaderTreeDefine,
  IDimension,
  IIndicatorCustom,
  ColumnsDefine,
  ColumnDefine,
  LinkColumnDefine,
  ChartColumnDefine,
  ImageColumnDefine,
  SparklineColumnDefine,
  ProgressbarColumnDefine,
  TextColumnDefine,
  GroupColumnDefine,
  themes,
  data,
  MousePointerCellEvent,
  getIcons,
  clearGlobal,
  //plugin registers
  register,
  /**
   * 暂不推荐使用
   */
  DataStatistics,
  CustomLayout
};

/** @private */
function getIcons(): {
  [key: string]: TYPES.ColumnIconOption;
} {
  return icons.get();
}
/** 清理内部的全局变量 如注册的icon theme等 以及共享的header column类实例 */
function clearGlobal() {
  register.clearAll();
  // headers.type.clearGlobal();
  // columns.type.clearGlobal();
}
TYPES.AggregationType;
