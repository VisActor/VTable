import { isArray, isValid } from '@visactor/vutils';
import type { SimpleHeaderLayoutMap } from '../../layout';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { ColumnDefine, ListTableConstructorOptions } from '../../ts-types';
import { HierarchyState } from '../../ts-types';
import type { BaseTableAPI, HeaderData } from '../../ts-types/base-table';

export function getHierarchyOffset(col: number, row: number, table: BaseTableAPI): number {
  // 处理树形展开
  let cellHierarchyIndent = 0;
  const layoutMap = table.internalProps.layoutMap;
  //判断是否为表头
  if (layoutMap.isHeader(col, row)) {
    const hd = layoutMap.getHeader(col, row) as HeaderData;
    if (isValid(hd?.hierarchyLevel)) {
      cellHierarchyIndent =
        (hd.hierarchyLevel ?? 0) *
        ((layoutMap as PivotHeaderLayoutMap).rowHierarchyType === 'tree'
          ? (layoutMap as PivotHeaderLayoutMap).rowHierarchyIndent ?? 0
          : 0);
      if (
        (layoutMap as PivotHeaderLayoutMap).rowHierarchyTextStartAlignment &&
        !table.internalProps.headerHelper.getHierarchyIcon(col, row)
      ) {
        cellHierarchyIndent += table.internalProps.headerHelper.getHierarchyIconWidth();
      }
    }
  } else {
    // 基本表格表身body单元格 如果是树形展开 需要考虑缩进值
    // const cellHierarchyState = table.getHierarchyState(col, row);
    if (
      (table.options as ListTableConstructorOptions).groupBy ||
      (table.getBodyColumnDefine(col, row) as ColumnDefine)?.tree
    ) {
      const indexArr = table.dataSource.getIndexKey(table.getRecordShowIndexByCell(col, row));
      const groupLength = table.dataSource.getGroupLength() ?? 0;
      let indexArrLngth = isArray(indexArr) ? indexArr.length - 1 : 0;
      if (groupLength > 0 && indexArrLngth === groupLength) {
        indexArrLngth = 0;
      }
      cellHierarchyIndent =
        Array.isArray(indexArr) && table.getHierarchyState(col, row) !== HierarchyState.none
          ? indexArrLngth * ((layoutMap as SimpleHeaderLayoutMap).hierarchyIndent ?? 0)
          : 0;
      if (
        (layoutMap as SimpleHeaderLayoutMap).hierarchyTextStartAlignment &&
        !table.internalProps.bodyHelper.getHierarchyIcon(col, row)
      ) {
        cellHierarchyIndent += table.internalProps.bodyHelper.getHierarchyIconWidth();
      }
    }
  }

  return cellHierarchyIndent;
}
