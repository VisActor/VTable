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
import { Direction, APPLY_TYPE, CellValueType } from './types';
import type {
  ISourceDataPiece,
  ICellData,
  Nullable,
  IRuleConfirmedData,
  IDiscreteRange,
  IAutoFillLocation
} from './types';
import { AutoFillService } from './auto-fill-services';
import { otherRule } from './rules';
import { fillCopy, getDataIndex, getLenS } from './fill-tools';
import type { ICopyDataInType } from './fill-tools';
import type { APPLY_FUNCTIONS } from './types';
import type { CellRange } from '@visactor/vtable/es/ts-types/table-engine';
import type { ListTable } from '@visactor/vtable';
import * as VTable from '@visactor/vtable';
import { getSelectedRangeArray, getTargetRange, openAutoFillMenu, getCellMatrix } from './auto-fill-helper';
export class AutoFillManager {
  // 源数据
  private sourceData: ISourceDataPiece[] = [];
  // autoFillService 维护规则列表
  private autoFillService: AutoFillService;
  // 表格实例
  private tableInstance: ListTable;
  // 源范围
  private sourceRange: IDiscreteRange;
  // 目标范围
  private targetRange: IDiscreteRange;
  // 填充方向
  private direction: Direction;
  // 行列头
  private headers: {
    row: Set<number>;
    col: Set<number>;
  };

  constructor() {
    this.autoFillService = new AutoFillService();
  }

  setTable(table: ListTable) {
    this.headers = {
      row: new Set(),
      col: new Set()
    };
    this.tableInstance = table;
    table.on(VTable.TABLE_EVENT_TYPE.DROPDOWN_MENU_CLICK, (args: any) => {
      if (args.text === '复制填充') {
        this.fillData(APPLY_TYPE.COPY);
      } else if (args.text === '序列填充') {
        this.fillData(APPLY_TYPE.SERIES);
      }
    });

    //cal headers
    const rowHeaderCells = this.tableInstance.getAllRowHeaderCells()[0];
    if (rowHeaderCells) {
      rowHeaderCells.forEach(cell => {
        this.headers.col.add(cell.col);
      });
    }
    const colHeaderCells = this.tableInstance.getAllColumnHeaderCells()[0];
    if (colHeaderCells) {
      colHeaderCells.forEach(cell => {
        this.headers.row.add(cell.row);
      });
    }
  }

  // 开始拖拽
  startDrag(selectedRange: CellRange) {
    this.sourceRange = getSelectedRangeArray(selectedRange);
    this.sourceRange.cols = this.sourceRange.cols.filter(col => !this.headers.col.has(col));
    this.sourceRange.rows = this.sourceRange.rows.filter(row => !this.headers.row.has(row));
  }
  // 结束拖拽
  endDrag(endSelectCellRange: CellRange, direction: string) {
    // set direction
    this.direction = direction as Direction;
    // set target range
    const selectedRange = getSelectedRangeArray(endSelectCellRange);
    this.targetRange = getTargetRange(this.direction, this.sourceRange, selectedRange);
    this.targetRange.cols = this.targetRange.cols.filter(col => !this.headers.col.has(col));
    this.targetRange.rows = this.targetRange.rows.filter(row => !this.headers.row.has(row));
    // open auto fill menu
    openAutoFillMenu(this.tableInstance, Math.max(...selectedRange.cols), Math.max(...selectedRange.rows));
  }

  dbClick() {
    if (!this.sourceRange) {
      return;
    }
    this.direction = Direction.DOWN;
    // 双击填充时，自动检测填充范围
    const detectFillRange = getSelectedRangeArray(this._detectFillRange());
    this.targetRange = getTargetRange(this.direction, this.sourceRange, detectFillRange);
    this.targetRange.cols = this.targetRange.cols.filter(col => !this.headers.col.has(col));
    this.targetRange.rows = this.targetRange.rows.filter(row => !this.headers.row.has(row));
    this.fillData(APPLY_TYPE.COPY);
  }

  /**
   * 填充数据
   * @param applyType - 填充类型
   */
  fillData(applyType: APPLY_TYPE) {
    // 获取源数据
    this.sourceData = this.getSourceData(this.sourceRange, this.direction);
    const location = {
      source: this.sourceRange,
      target: this.targetRange
    };

    // 填充数据
    this._fillData(location, this.direction, applyType);
  }
  /**
   * 获取源数据
   * @param source - 源范围
   * @param direction - 方向
   * @returns 源数据
   */
  private getSourceData(source: IDiscreteRange, direction: Direction) {
    const rules = this.autoFillService.getRules();
    const sourceData: ISourceDataPiece[] = [];
    const isVertical = direction === Direction.DOWN || direction === Direction.UP;
    let aArray: number[];
    let bArray: number[];
    if (isVertical) {
      aArray = source.cols;
      bArray = source.rows;
    } else {
      aArray = source.rows;
      bArray = source.cols;
    }
    // 按照行或列将源数据分成多个片段，获取单元格数据
    aArray.forEach(a => {
      const sourceDataPiece = this.getEmptySourceDataPiece();
      const prevData: IRuleConfirmedData = {
        type: undefined,
        cellData: undefined
      };
      bArray.forEach(b => {
        let data: Nullable<ICellData>;
        if (isVertical) {
          data = {
            v: '' + this.tableInstance.getCellValue(a, b),
            t: CellValueType.STRING
          };
        } else {
          data = {
            v: '' + this.tableInstance.getCellValue(b, a),
            t: CellValueType.STRING
          };
        }
        const { type, isContinue } = rules.find(r => r.match(data, null)) || otherRule;
        if (isContinue(prevData, data)) {
          const typeInfo = sourceDataPiece[type];

          const last = typeInfo![typeInfo!.length - 1];
          last.data.push(data);
          last.index.push(b - bArray[0]);
        } else {
          const typeInfo = sourceDataPiece[type];
          if (typeInfo) {
            typeInfo.push({
              data: [data],
              index: [b - bArray[0]]
            });
          } else {
            sourceDataPiece[type] = [
              {
                data: [data],
                index: [b - bArray[0]]
              }
            ];
          }
        }
        prevData.type = type;
        prevData.cellData = data;
      });
      sourceData.push(sourceDataPiece);
    });
    return sourceData;
  }
  /**
   * 获取空的片段数据对象
   * @returns 空的片段数据对象
   */
  private getEmptySourceDataPiece() {
    const sourceDataPiece: ISourceDataPiece = {};
    this.autoFillService.getRules().forEach(r => {
      sourceDataPiece[r.type] = [];
    });

    return sourceDataPiece;
  }
  /**
   * 快速填充检测填充范围
   * @returns 填充范围
   */
  private _detectFillRange() {
    // sourceRange
    const start = { row: Math.min(...this.sourceRange.rows), col: Math.min(...this.sourceRange.cols) };
    const end = { row: Math.max(...this.sourceRange.rows), col: Math.max(...this.sourceRange.cols) };
    // matrix
    const matrix = getCellMatrix(this.tableInstance);
    const maxRow = matrix.getMaxRows();
    const maxColumn = matrix.getMaxColumns();
    let detectEndRow = end.row;
    // left column first, or consider right column.
    if (start.col > 0 && matrix.getValue(start.row, start.col - 1)?.v != null) {
      let cur = start.row;
      while (matrix.getValue(cur, start.col - 1)?.v != null && cur < maxRow) {
        cur += 1;
      }
      detectEndRow = cur - 1;
    } else if (end.col < maxColumn && matrix.getValue(end.row, end.col + 1)?.v != null) {
      let cur = start.row;
      while (matrix.getValue(cur, end.col + 1)?.v != null && cur < maxRow) {
        cur += 1;
      }
      detectEndRow = cur - 1;
    }
    for (let i = end.row + 1; i <= detectEndRow; i++) {
      for (let j = start.col; j <= end.col; j++) {
        if (matrix.getValue(i, j)?.v) {
          detectEndRow = i - 1;
          break;
        }
      }
    }
    return {
      start: { row: start.row, col: start.col },
      end: { row: detectEndRow, col: end.col }
    };
  }

  /**
   * 填充数据
   * @param location - 位置
   * @param direction - 方向
   * @param applyType - 填充类型
   */
  private _fillData(location: IAutoFillLocation, direction: Direction, applyType: APPLY_TYPE) {
    const { source, target } = location;
    if (!source || !target || direction == null) {
      return;
    }

    const { cols: targetCols, rows: targetRows } = target;
    const { cols: sourceCols, rows: sourceRows } = source;

    const sourceData = this.sourceData;

    let csLen;
    if (direction === Direction.DOWN || direction === Direction.UP) {
      csLen = sourceRows.length;
    } else {
      csLen = sourceCols.length;
    }

    const applyDatas: Array<Array<Nullable<ICellData>>> = [];

    if (direction === Direction.DOWN || direction === Direction.UP) {
      const asLen = targetRows.length;
      const untransformedApplyDatas: Nullable<ICellData>[][] = [];
      targetCols.forEach((_, i) => {
        const copyD = sourceData[i];
        const applyData = this.getApplyData(copyD, csLen, asLen, direction, applyType, location);
        untransformedApplyDatas.push(applyData);
      });
      for (let i = 0; i < untransformedApplyDatas[0].length; i++) {
        const row: Array<Nullable<ICellData>> = [];
        for (let j = 0; j < untransformedApplyDatas.length; j++) {
          row.push({
            s: null,
            ...untransformedApplyDatas[j][i]
          });
        }
        applyDatas.push(row);
      }
    } else {
      const asLen = targetCols.length;
      targetRows.forEach((_, i) => {
        const copyD = sourceData[i];
        const applyData = this.getApplyData(copyD, csLen, asLen, direction, applyType, location);
        const row: Array<Nullable<ICellData>> = [];
        for (let j = 0; j < applyData.length; j++) {
          row.push({
            s: null,
            ...applyData[j]
          });
        }
        applyDatas.push(row);
      });
    }

    // 获取填充的值
    const values: string[][] = [];
    targetRows.forEach((row, rowIndex) => {
      const rowValues: string[] = [];
      targetCols.forEach((col, colIndex) => {
        if (applyDatas[rowIndex][colIndex]) {
          rowValues.push(applyDatas[rowIndex][colIndex]!.v + '');
        }
      });
      values.push(rowValues);
    });
    // 获取填充开始的行和列，设置表格值
    const minRow = Math.min(...targetRows);
    const minCol = Math.min(...targetCols);
    this.tableInstance.changeCellValues(minCol, minRow, values);
  }

  /**
   * 根据源数据计算填充数据
   * @param sourceDataPiece - 源数据片段
   * @param csLen - 源长度
   * @param asLen - 目标长度
   * @param direction - 方向
   * @param applyType - 填充类型
   * @param location - 位置
   * @returns 填充数据
   */
  private getApplyData(
    sourceDataPiece: ISourceDataPiece,
    csLen: number,
    asLen: number,
    direction: Direction,
    applyType: APPLY_TYPE,
    location: IAutoFillLocation
  ) {
    const applyData: Array<Nullable<ICellData>> = [];
    const num = Math.floor(asLen / csLen);
    const rsd = asLen % csLen;
    const rules = this.autoFillService.getRules();

    const applyDataInTypes: { [key: string]: any[] } = {};

    rules.forEach(r => {
      applyDataInTypes[r.type] = [];
    });

    // calc cell data to apply
    rules.forEach(r => {
      const { type, applyFunctions: customApplyFunctions = {} } = r;
      const copyDataInType = sourceDataPiece[type];
      if (!copyDataInType) {
        return;
      }
      // copyDataInType is an array of copy-squads in same types
      // a copy-squad is an array of continuous cells that has the same type, e.g. [1, 3, 5] is a copy squad, but [1, 3, ab, 5] will be divided into two copy-squads
      copyDataInType.forEach(copySquad => {
        const s = getLenS(copySquad.index, rsd);
        const len = copySquad.index.length * num + s;

        // We do not process cell.custom by default. If the user needs to process it, they can do so in the hook extension.
        const arrData = this.applyFunctions(
          copySquad,
          len,
          direction,
          applyType,
          customApplyFunctions,
          sourceDataPiece,
          location
        );

        const arrIndex = getDataIndex(csLen, asLen, copySquad.index);
        applyDataInTypes[type].push({ data: arrData, index: arrIndex });
      });
    });

    // calc index
    for (let x = 0; x < asLen; x++) {
      rules.forEach(r => {
        const { type } = r;
        const applyDataInType = applyDataInTypes[type];
        for (let y = 0; y < applyDataInType.length; y++) {
          if (x in applyDataInType[y].index) {
            applyData.push(applyDataInType[y].data[applyDataInType[y].index[x]]);
          }
        }
      });
    }

    return applyData;
  }
  /**
   * 根据规则计算填充函数
   * @param copySquad - 复制数据
   * @param len - 长度
   * @param direction - 方向
   * @param applyType - 填充类型
   * @param customApplyFunctions - 自定义应用函数
   * @param sourceDataPiece - 源数据片段
   * @param location - 位置
   * @returns 填充数据
   */
  private applyFunctions(
    copySquad: ICopyDataInType,
    len: number,
    direction: Direction,
    applyType: APPLY_TYPE,
    customApplyFunctions: APPLY_FUNCTIONS,
    sourceDataPiece: ISourceDataPiece,
    location: IAutoFillLocation
  ) {
    const { data } = copySquad;
    const isReverse = direction === Direction.UP || direction === Direction.LEFT;

    // 复制填充
    if (applyType === APPLY_TYPE.COPY) {
      const custom = customApplyFunctions?.[APPLY_TYPE.COPY];
      if (custom) {
        return custom(copySquad, len, direction, sourceDataPiece, location);
      }
      isReverse && data.reverse();
      return fillCopy(data, len);
    }
    // 序列填充
    if (applyType === APPLY_TYPE.SERIES) {
      const custom = customApplyFunctions?.[APPLY_TYPE.SERIES];
      if (custom) {
        return custom(copySquad, len, direction, sourceDataPiece);
      }
      isReverse && data.reverse();
      // special rules, if not provide custom SERIES apply functions, will be applied as copy
      if (customApplyFunctions?.[APPLY_TYPE.COPY]) {
        return customApplyFunctions[APPLY_TYPE.COPY](copySquad, len, direction, sourceDataPiece, location);
      }
      return fillCopy(data, len);
    }
  }
}
