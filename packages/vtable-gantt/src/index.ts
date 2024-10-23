import type { GanttConstructorOptions } from './ts-types';
import * as TYPES from './ts-types';
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
  TextAlignType,
  TextBaselineType
} from '@visactor/vtable';
import { Gantt } from './Gantt';
import * as tools from './tools';
import * as VRender from './vrender';
import * as VTable from './vtable';
export const version = __VERSION__;
/**
 * @namespace VTable
 */
export {
  TYPES,
  GanttConstructorOptions,
  Gantt,
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
  tools,
  VRender,
  VTable
};
