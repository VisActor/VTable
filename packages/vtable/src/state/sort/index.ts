import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import { defaultOrderFn } from '../../tools/util';
import type { ColumnDefine, HeaderData, HeaderDefine, ListTableAPI, SortState } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

/**
 * @description: 执行sort
 * @param {number} col
 * @param {number} row
 * @param {BaseTableAPI} table
 * @return {*}
 */
export function dealSort(col: number, row: number, table: ListTableAPI, event: Event) {
  //是击中的sort按钮才进行排序
  let range1 = null;
  let tableState: SortState;
  let isTargetCell = false;
  //找出当前表头是否在sortState排序规则中
  if (Array.isArray(table.sortState)) {
    for (let i = 0; i < table.sortState.length; i++) {
      tableState = table.sortState[i];
      if (tableState) {
        range1 = table._getHeaderCellBySortState(tableState);
      }
      range1 && (isTargetCell = isTarget(col, row, range1.col, range1.row, table));
      if (isTargetCell) {
        break;
      }
    }
  } else {
    tableState = table.sortState;
    if (tableState) {
      range1 = table._getHeaderCellBySortState(tableState);
    }
    range1 && (isTargetCell = isTarget(col, row, range1.col, range1.row, table));
  }

  const headerC = table.getHeaderDefine(col, row) as ColumnDefine;
  //当前排序规则是该表头field 且 表头设置了sort规则 需要转变sort的状态
  if (tableState && isTargetCell && headerC?.sort) {
    tableState.order = tableState.order === 'asc' ? 'desc' : tableState.order === 'desc' ? 'normal' : 'asc';
  } else if (headerC?.sort) {
    //如果当前表头设置了sort 则 转变sort的状态
    tableState = {
      field: <string>table.getHeaderField(col, row),
      order: 'asc'
    };
  } else if (isTargetCell && headerC?.showSort) {
    //当前排序规则是该表头field 且仅为显示showSort无sort 什么也不做
  } else {
    tableState = {
      field: <string>table.getHeaderField(col, row),
      order: 'normal'
    };
  }
  (tableState as SortState & { event: Event }).event = event;
  // 如果用户监听SORT_CLICK事件的回调函数返回false 则不执行内部排序逻辑
  const sortEventReturns = table.fireListeners(TABLE_EVENT_TYPE.SORT_CLICK, tableState as SortState & { event: Event });
  if (sortEventReturns.includes(false)) {
    return;
  }
  let isArraySortState = false;
  let sortState: SortState | SortState[] = table.internalProps.sortState
    ? Array.isArray(table.internalProps.sortState) && (isArraySortState = true)
      ? (table.internalProps.sortState as SortState[])
      : [table.internalProps.sortState as SortState]
    : [];
  if (Array.isArray(sortState)) {
    const index = (sortState as SortState[]).findIndex(item => item.field === tableState.field);
    if (index >= 0) {
      sortState[index] = tableState;
    } else {
      sortState.push(tableState);
    }
  }
  sortState = (sortState as SortState[]).filter(item => item.order !== 'normal');
  sortState = table.internalProps.multipleSort && (isArraySortState = true) ? sortState : sortState.splice(-1);
  sortState = isArraySortState && sortState.length ? (sortState as SortState[]) : (sortState[0] as SortState);
  table.internalProps.sortState = sortState; // 目前不支持多级排序 所以这里 直接赋值为单个sortState TODO优化（如果支持多级排序的话）
  table.stateManager.setSortState(sortState);
  if (headerC?.sort) {
    executeSort(sortState, table, headerC);
  }

  // clear cell range cache
  table.internalProps.useOneRowHeightFillAll = false;
  table.internalProps.layoutMap.clearCellRangeMap();

  table.scenegraph.sortCell();
  // 排序后，清除选中效果
  const isHasSelected = !!table.stateManager.select.ranges?.length;
  table.stateManager.updateSelectPos(-1, -1);
  table.stateManager.endSelectCells(true, isHasSelected);
}

function executeSort(newState: SortState | SortState[], table: BaseTableAPI, headerDefine: HeaderDefine): void {
  newState = Array.isArray(newState) || !newState ? newState : [newState];
  table.dataSource.sort(
    ((newState || []) as Array<any>).map(item => {
      const hd = table.internalProps.layoutMap.headerObjects.find((col: HeaderData) => col && col.field === item.field);
      return {
        field: item.field,
        order: item.order || 'asc',
        orderFn: typeof hd?.define?.sort === 'function' ? hd?.define?.sort : defaultOrderFn
      };
    })
  );
}

function isTarget(col: number, row: number, range1Col: number, range1Row: number, table: BaseTableAPI): boolean {
  return table._getLayoutCellId(col, row) === table._getLayoutCellId(range1Col, range1Row);
}
