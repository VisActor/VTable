import type { ColumnDefine } from '../../../../../vtable/src/ts-types';
import { useCallback, useRef } from 'react';
import { generateAutoFillData } from './autoFillHandle';
import type { IVTable } from '../../../../src/tables/base-table';
import { TABLE_EVENTS, TABLE_EVENTS_KEYS } from '../../../../src/eventsUtils';
export const useDragHandle = (props: { tableInstance: IVTable }) => {
  const { tableInstance } = props;
  const beforeDragMinCol = useRef(0);
  const beforeDragMinRow = useRef(0);
  const beforeDragMaxCol = useRef(0);
  const beforeDragMaxRow = useRef(0);

  const handleStartDrag = useCallback(() => {
    const startSelectCellRange = tableInstance.current?.getSelectedCellRanges()[0];
    if (!startSelectCellRange) {
      return;
    }
    beforeDragMaxCol.current = Math.max(startSelectCellRange.start.col, startSelectCellRange.end.col);
    beforeDragMinCol.current = Math.min(startSelectCellRange.start.col, startSelectCellRange.end.col);
    beforeDragMaxRow.current = Math.max(startSelectCellRange.start.row, startSelectCellRange.end.row);
    beforeDragMinRow.current = Math.min(startSelectCellRange.start.row, startSelectCellRange.end.row);
  }, [tableInstance]);

  const handleEndDrag = useCallback(
    (arg: { direction?: 'top' | 'bottom' | 'left' | 'right' }) => {
      const direciton = arg.direction;
      let endChangeCellCol;
      let endChangeCellRow;
      const endSelectCellRange = tableInstance.current?.getSelectedCellRanges()[0];
      if (!endSelectCellRange) {
        return;
      }
      //根据填充方向 确定需要填充值的范围
      if (direciton === 'bottom') {
        endChangeCellCol = beforeDragMaxCol.current;
        endChangeCellRow = endSelectCellRange.end.row;
      } else if (direciton === 'right') {
        endChangeCellCol = endSelectCellRange.end.col;
        endChangeCellRow = beforeDragMaxRow.current;
      } else if (direciton === 'top') {
        endChangeCellCol = beforeDragMaxCol.current;
        endChangeCellRow = endSelectCellRange.end.row;
      } else if (direciton === 'left') {
        endChangeCellCol = endSelectCellRange.end.col;
        endChangeCellRow = beforeDragMaxRow.current;
      }
      const rowDatas = tableInstance.current?.records;
      const tableColumns = tableInstance.current?.getAllColumnHeaderCells() || [];
      let highestColumns: ColumnDefine[] = [];
      if (tableColumns?.length) {
        highestColumns = tableColumns[tableColumns.length - 1];
      }
      const newDatas = generateAutoFillData(
        rowDatas,
        highestColumns,
        {
          startRow: beforeDragMinRow.current - tableColumns.length,
          startCol: beforeDragMinCol.current,
          endRow: beforeDragMaxRow.current - tableColumns.length,
          endCol: beforeDragMaxCol.current
        },
        {
          row: endChangeCellRow - tableColumns.length,
          col: endChangeCellCol
        }
      );
      tableInstance.current?.setRecords(newDatas);
    },
    [tableInstance]
  );
  return {
    handleStartDrag,
    handleEndDrag
  };
};
