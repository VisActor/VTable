/* eslint-disable sort-imports */
import { graphicUtil, registerForVrender } from '@src/vrender';
registerForVrender();

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
  PivotChartConstructorOptions,
  IHeaderTreeDefine,
  IDimension,
  IIndicator,
  ITitleDefine,
  ICornerDefine,
  TextAlignType,
  TextBaselineType
} from './ts-types';
import { ListTable } from './ListTable';
import { PivotTable } from './PivotTable';
import { PivotChart } from './PivotChart';
import type { MousePointerCellEvent } from './ts-types/events';
import * as CustomLayout from './render/layout';

import { updateCell } from './scenegraph/group-creater/cell-helper';
import { renderChart } from './scenegraph/graphic/contributions/chart-render-helper';
import { restoreMeasureText, setCustomAlphabetCharSet } from './scenegraph/utils/text-measure';

// import { container, loadCanvasPicker } from '@src/vrender';
// loadCanvasPicker(container);

export { getDataCellPath } from './tools/get-data-path';
export * from './render/jsx';

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
  PivotChartConstructorOptions,
  PivotChart,
  IHeaderTreeDefine,
  IDimension,
  IIndicator,
  ITitleDefine,
  ICornerDefine,
  ColumnsDefine,
  ColumnDefine,
  LinkColumnDefine,
  ChartColumnDefine,
  ImageColumnDefine,
  SparklineColumnDefine,
  ProgressbarColumnDefine,
  TextColumnDefine,
  GroupColumnDefine,
  TextAlignType,
  TextBaselineType,
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
  CustomLayout,
  updateCell,
  renderChart,
  graphicUtil,
  setCustomAlphabetCharSet,
  restoreMeasureText
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
