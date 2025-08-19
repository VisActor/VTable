/**
 * Copyright 2023-present DreamNum Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export enum Direction {
  UP = 'top',
  RIGHT = 'right',
  DOWN = 'bottom',
  LEFT = 'left'
}
// auto fill rule
export interface IAutoFillRule {
  type: string;
  match: (cellData: Nullable<ICellData>, accessor: any) => boolean;
  isContinue: (prev: IRuleConfirmedData, cur: Nullable<ICellData>) => boolean;
  applyFunctions?: APPLY_FUNCTIONS;
  priority: number;
}

export interface IRuleConfirmedData {
  type?: string;
  cellData: Nullable<ICellData>;
}

export type APPLY_FUNCTIONS = {
  [key in APPLY_TYPE]?: (
    dataWithIndex: ICopyDataInType,
    len: number,
    direction: Direction,
    copyDataPiece: ISourceDataPiece,
    location?: IAutoFillLocation
  ) => Array<Nullable<ICellData>>;
};

export enum APPLY_TYPE {
  COPY = 'COPY',
  SERIES = 'SERIES'
  // ONLY_FORMAT = 'ONLY_FORMAT',
  // NO_FORMAT = 'NO_FORMAT'
}

export interface IAutoFillLocation {
  source: IDiscreteRange;
  target: IDiscreteRange;
}

export interface IDiscreteRange {
  rows: number[];
  cols: number[];
}

// copy data
export interface ISourceDataPiece {
  [key: string]: ICopyDataInType[];
}

export interface ICopyDataInType {
  data: Array<Nullable<ICellData>>;
  index: ICopyDataInTypeIndexInfo;
}

export type ICopyDataInTypeIndexInfo = number[];

// cell data
/**
 * Cell value type
 */
export type CellValue = string | number | boolean;
/**
 * Cell data
 */
export interface ICellData {
  /**
   * Origin value
   */
  v?: Nullable<CellValue>;

  // Usually the type is automatically determined based on the data, or the user directly specifies
  t?: Nullable<CellValueType>; // 1 string, 2 number, 3 boolean, 4 force string, green icon, set null for cell clear all
}

export type CustomData = Nullable<Record<string, any>>;

/**
 * General Boolean Enum
 */
export enum CellValueType {
  STRING = 1,
  NUMBER,
  BOOLEAN,
  FORCE_STRING
}

export type Nullable<T> = T | null | undefined | void;

/**
 * Key value object
 *
 * @ignore
 * @deprecated As it has
 */
export interface IKeyValue {
  [key: string]: any;
}
export enum DATA_TYPE {
  NUMBER = 'number',
  DATE = 'date',
  EXTEND_NUMBER = 'extendNumber',
  CHN_NUMBER = 'chnNumber',
  CHN_WEEK2 = 'chnWeek2',
  CHN_WEEK3 = 'chnWeek3',
  LOOP_SERIES = 'loopSeries',
  FORMULA = 'formula',
  OTHER = 'other'
}
