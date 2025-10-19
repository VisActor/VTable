import type { CellRange } from '@visactor/vtable/es/ts-types/table-engine';
import { CellValueType } from './types';
import type { ListTable } from '@visactor/vtable';
import { Direction, IDiscreteRange } from './types';
export interface ISelectedRangeArray {
  cols: number[];
  rows: number[];
}

export function getSelectedRangeArray(selectedRange: CellRange): ISelectedRangeArray {
  const minCol = Math.min(selectedRange.start.col, selectedRange.end.col);
  const minRow = Math.min(selectedRange.start.row, selectedRange.end.row);
  const maxCol = Math.max(selectedRange.start.col, selectedRange.end.col);
  const maxRow = Math.max(selectedRange.start.row, selectedRange.end.row);
  const cols = [];
  const rows = [];
  for (let i = minCol; i <= maxCol; i++) {
    cols.push(i);
  }
  for (let i = minRow; i <= maxRow; i++) {
    rows.push(i);
  }
  return { cols, rows };
}

/**
 * 获取目标范围，根据源范围和选中的范围计算目标范围
 * @param direction - 方向
 * @param sourceRange - 源范围
 * @param selectedRange - 选中的范围
 * @returns 目标范围
 */
export function getTargetRange(direction: Direction, sourceRange: IDiscreteRange, selectedRange: ISelectedRangeArray) {
  if (direction === Direction.DOWN || direction === Direction.UP) {
    return {
      cols: selectedRange.cols,
      rows: selectedRange.rows.filter(row => !sourceRange.rows.includes(row))
    };
  } else {
    return {
      cols: selectedRange.cols.filter(col => !sourceRange.cols.includes(col)),
      rows: selectedRange.rows
    };
  }
}

/**
 * 打开自动填充菜单
 * @param tableInstance - 表格实例
 * @param endCol - 结束列
 * @param endRow - 结束行
 */
export function openAutoFillMenu(tableInstance: ListTable, endCol: number, endRow: number) {
  const rect = tableInstance.scenegraph.highPerformanceGetCell(endCol, endRow).globalAABBBounds;
  tableInstance.showDropDownMenu(endCol, endRow, {
    content: [
      {
        type: 'item',
        text: '复制填充',
        icon: {
          width: 16,
          height: 16,
          svg: '<svg t="1756136702877" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1474" width="200" height="200"><path d="M853.333333 981.333333h-384c-72.533333 0-128-55.466667-128-128v-384c0-72.533333 55.466667-128 128-128h384c72.533333 0 128 55.466667 128 128v384c0 72.533333-55.466667 128-128 128z m-384-554.666666c-25.6 0-42.666667 17.066667-42.666666 42.666666v384c0 25.6 17.066667 42.666667 42.666666 42.666667h384c25.6 0 42.666667-17.066667 42.666667-42.666667v-384c0-25.6-17.066667-42.666667-42.666667-42.666666h-384z" p-id="1475"></path><path d="M213.333333 682.666667H170.666667c-72.533333 0-128-55.466667-128-128V170.666667c0-72.533333 55.466667-128 128-128h384c72.533333 0 128 55.466667 128 128v42.666666c0 25.6-17.066667 42.666667-42.666667 42.666667s-42.666667-17.066667-42.666667-42.666667V170.666667c0-25.6-17.066667-42.666667-42.666666-42.666667H170.666667c-25.6 0-42.666667 17.066667-42.666667 42.666667v384c0 25.6 17.066667 42.666667 42.666667 42.666666h42.666666c25.6 0 42.666667 17.066667 42.666667 42.666667s-17.066667 42.666667-42.666667 42.666667z" p-id="1476"></path></svg>'
        }
      },
      {
        type: 'item',
        text: '序列填充',
        icon: {
          width: 16,
          height: 16,
          svg: '<svg t="1756136788547" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2463" width="200" height="200"><path d="M312.832482 65.167035H959.204489c35.706211 0 64.64232 29.473622 64.64232 65.832527 0 36.346107-28.936109 65.832527-64.629522 65.832527H312.819684c-35.693413 0-64.629522-29.473622-64.629522-65.832527 0-36.346107 28.936109-65.832527 64.629522-65.832527z m0 394.982363H959.204489c35.706211 0 64.64232 29.460824 64.64232 65.819729 0 36.358905-28.936109 65.832527-64.629522 65.832527H312.819684c-35.693413 0-64.629522-29.473622-64.629522-65.832527 0-36.346107 28.936109-65.819729 64.629522-65.819729z m0 394.969566H959.204489c35.706211 0 64.64232 29.473622 64.64232 65.819729 0 36.358905-28.936109 65.832527-64.629522 65.832527H312.819684c-35.693413 0-64.629522-29.473622-64.629522-65.832527 0-36.346107 28.936109-65.819729 64.629522-65.819729zM12.286008 69.108796V38.176211c9.892796 0.767876 19.836784 0.767876 29.72958 0A41.823619 41.823619 0 0 0 63.989626 25.672638c4.261709-4.671243 7.358807-10.315128 9.048133-16.458132 0.37114-3.058704 0.37114-6.143004 0-9.214506H114.413451v229.748352H65.93491V69.108796H12.286008z m0 510.176487a130.730805 130.730805 0 0 1 45.240665-49.374395 334.537763 334.537763 0 0 0 40.070304-32.250771 48.47854 48.47854 0 0 0 14.218495-33.581756 37.31875 37.31875 0 0 0-7.755543-24.354451 28.193829 28.193829 0 0 0-23.266628-9.879998 27.643518 27.643518 0 0 0-31.02217 15.139945 78.27211 78.27211 0 0 0-5.170362 28.30901H2.585181a114.311067 114.311067 0 0 1 10.340723-48.056208c12.388392-24.124089 38.086625-37.984242 64.629522-34.887144a79.897447 79.897447 0 0 1 57.539472 20.41269 71.783562 71.783562 0 0 1 21.321343 53.981648 74.637499 74.637499 0 0 1-14.858391 46.072531 152.16733 152.16733 0 0 1-32.967455 29.627197L90.481331 553.625443l-23.266628 17.763521c-4.082538 3.583419-7.563574 7.806734-10.353522 12.51637h99.542262v40.147092H0a110.945213 110.945213 0 0 1 10.340724-45.419837l1.945284 0.665492zM44.600769 948.582211a53.495327 53.495327 0 0 0 4.517668 23.036265 30.279891 30.279891 0 0 0 29.742378 17.110826c7.422797 0.255959 14.717614-2.073264 20.681447-6.578133 6.7829-6.962071 10.315128-16.547717 9.688029-26.325332a30.356678 30.356678 0 0 0-18.096266-30.945383 91.735527 91.735527 0 0 0-32.314761-8.561812V883.440772a83.903197 83.903197 0 0 0 30.382274-4.607253 27.106005 27.106005 0 0 0 14.858391-28.30901 30.612637 30.612637 0 0 0-7.755542-21.730877 27.528337 27.528337 0 0 0-21.321344-8.549014 26.939632 26.939632 0 0 0-23.279425 10.532692 44.063256 44.063256 0 0 0-7.102849 27.643519H2.585181a117.101015 117.101015 0 0 1 5.823056-32.916264 74.381541 74.381541 0 0 1 17.443572-25.019944 60.534186 60.534186 0 0 1 20.681447-12.503572 89.55988 89.55988 0 0 1 29.742378-3.289067A78.540867 78.540867 0 0 1 129.259044 801.79001a57.744238 57.744238 0 0 1 20.041551 46.085328 51.921182 51.921182 0 0 1-12.286008 34.887144c-4.159326 5.170362-9.470465 9.227304-15.511086 11.850879 6.7829 1.510155 12.900309 5.208756 17.45637 10.532692a57.821026 57.821026 0 0 1 17.443572 44.10165 75.136618 75.136618 0 0 1-20.028753 52.010768 76.122059 76.122059 0 0 1-59.471958 22.383571 71.962733 71.962733 0 0 1-64.629522-32.250771A97.52019 97.52019 0 0 1 1.279793 946.611331l43.308178 1.97088z" fill="#515151" p-id="2464"></path></svg>'
        }
      }
    ],
    referencePosition: {
      // @ts-ignore
      rect: {
        right: rect.x2 + 110,
        bottom: rect.y2
      }
    }
  });
}

export function getCellMatrix(table: ListTable) {
  return {
    getValue: (row: number, col: number) => {
      const value = table.getCellValue(col, row);
      if (typeof value === 'number' || !isNaN(Number(value))) {
        return {
          v: value,
          t: CellValueType.NUMBER
        };
      }

      return {
        v: value || '',
        t: CellValueType.STRING
      };
    },
    getMaxRows: () => {
      return table.records.length;
    },
    getMaxColumns: () => {
      return table.columns.length;
    }
  };
}
/**
 * 判断当前单元格是否是合并单元格
 * @param table - 表格实例
 * @param col - 列
 * @param row - 行
 * @returns 合并单元格范围 如果当前单元格不是合并单元格，则返回null
 */
export function isMergeCell(table: ListTable, col: number, row: number) {
  const cellRange = table.getCellRange(col, row);
  if (cellRange.start.col !== cellRange.end.col || cellRange.start.row !== cellRange.end.row) {
    return cellRange;
  }
  return null;
}
