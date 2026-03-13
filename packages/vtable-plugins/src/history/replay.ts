import type { ListTable } from '@visactor/vtable';
import { applyCellContent, parseA1Notation } from './formula';
import type {
  AddColumnCommand,
  AddRecordCommand,
  CellCommand,
  ChangeHeaderPositionCommand,
  DeleteColumnCommand,
  DeleteRecordCommand,
  FilterCommand,
  HistoryCommand,
  MergeCellsCommand,
  ResizeColumnCommand,
  ResizeRowCommand,
  SortCommand,
  UpdateRecordCommand
} from './types';

function cloneMergeConfig(input: any): any {
  if (Array.isArray(input)) {
    return input.map(i => ({
      ...i,
      range: i?.range
        ? {
            start: { ...i.range.start },
            end: { ...i.range.end }
          }
        : i?.range
    }));
  }
  return input;
}

function getCustomMergeCellFunc(customMergeCell?: any) {
  if (typeof customMergeCell === 'function') {
    return customMergeCell;
  }
  if (Array.isArray(customMergeCell)) {
    return (col: number, row: number) => {
      return customMergeCell.find(item => {
        return (
          item.range.start.col <= col &&
          item.range.end.col >= col &&
          item.range.start.row <= row &&
          item.range.end.row >= row
        );
      });
    };
  }
  return undefined;
}

function applyMergeConfig(table: any, customMergeCell: any): void {
  if (!table?.options || !table?.internalProps) {
    return;
  }
  table.options.customMergeCell = cloneMergeConfig(customMergeCell);
  table.internalProps.customMergeCell = getCustomMergeCellFunc(table.options.customMergeCell);
}

function cloneSortState(input: any): any {
  if (!input) {
    return null;
  }
  if (Array.isArray(input)) {
    return input.filter(Boolean).map((s: any) => ({
      field: s.field,
      order: s.order
    }));
  }
  return {
    field: (input as any).field,
    order: (input as any).order
  };
}

export function replayCommand(args: {
  table: ListTable;
  vtableSheet: any;
  cmd: HistoryCommand;
  direction: 'undo' | 'redo';
  deleteRecordsByReference: (records: any[]) => void;
}): void {
  const { table, vtableSheet, cmd, direction, deleteRecordsByReference } = args;

  // 所有回放逻辑尽量只调用 table 的公开 API，避免依赖内部状态。
  switch (cmd.type) {
    case 'cell':
    case 'cells': {
      const sheetKey = cmd.sheetKey;
      const cells = (cmd as CellCommand).cells;
      cells.forEach(c => {
        const content = direction === 'undo' ? c.oldContent : c.newContent;
        applyCellContent({
          table,
          sheetKey,
          row: c.row,
          col: c.col,
          content,
          formulaManager: vtableSheet?.formulaManager
        });
      });
      break;
    }
    case 'merge_cells': {
      const c = cmd as MergeCellsCommand;
      const next = direction === 'undo' ? c.oldCustomMergeCell : c.newCustomMergeCell;
      applyMergeConfig(table as any, next);
      const sg = (table as any).scenegraph;
      if (sg?.updateCellContent) {
        for (let i = c.startCol; i <= c.endCol; i++) {
          for (let j = c.startRow; j <= c.endRow; j++) {
            sg.updateCellContent(i, j);
          }
        }
        sg.updateNextFrame?.();
      } else if (typeof (table as any).renderWithRecreateCells === 'function') {
        (table as any).renderWithRecreateCells();
      }
      break;
    }
    case 'filter': {
      const c = cmd as FilterCommand;
      const pluginId = (c as any).pluginId;
      const snapshot = direction === 'undo' ? (c as any).oldSnapshot : (c as any).newSnapshot;
      const pm = (table as any).pluginManager;
      const filterPlugin =
        pm?.getPlugin?.(pluginId) ??
        pm?.getPluginByName?.('Filter') ??
        pm?.getPlugin?.('filter') ??
        pm?.getPluginByName?.('filter');
      if (filterPlugin?.applyFilterSnapshot) {
        filterPlugin.applyFilterSnapshot(snapshot);
      }
      break;
    }
    case 'sort': {
      const c = cmd as SortCommand;
      const next = direction === 'undo' ? c.oldSortState : c.newSortState;
      (table as any).updateSortState?.(cloneSortState(next) ?? null, true);
      break;
    }
    case 'add_record': {
      const c = cmd as AddRecordCommand;
      if (direction === 'undo') {
        if (typeof c.recordIndex === 'number' && c.recordCount > 0) {
          const indexs: number[] = [];
          for (let i = 0; i < c.recordCount; i++) {
            indexs.push(c.recordIndex + i);
          }
          (table as any).deleteRecords?.(indexs);
        } else {
          deleteRecordsByReference(c.records);
        }
      } else {
        if (c.records.length) {
          (table as any).addRecords?.(c.records, c.recordIndex);
        }
      }
      break;
    }
    case 'delete_record': {
      const c = cmd as DeleteRecordCommand;
      if (direction === 'undo') {
        if ((table as any).addRecord && Array.isArray(c.records) && Array.isArray(c.recordIndexs)) {
          // 删除多行时常见的 index 顺序是倒序（便于 splice）。撤销必须按 idx 升序插入回去，保证行顺序稳定。
          const pairs: Array<{ idx: number; record: any }> = [];
          for (let i = 0; i < c.recordIndexs.length; i++) {
            const idx = c.recordIndexs[i];
            if (typeof idx === 'number') {
              pairs.push({ idx, record: c.records[i] });
            }
          }
          pairs.sort((a, b) => a.idx - b.idx);
          for (const p of pairs) {
            (table as any).addRecord(p.record, p.idx);
          }
        }
        if (c.deletedRowHeights && typeof (table as any).setRowHeight === 'function') {
          const headerCount = (table as any).transpose
            ? (table as any).rowHeaderLevelCount
            : (table as any).columnHeaderLevelCount;
          Object.keys(c.deletedRowHeights).forEach(k => {
            const idx = Number(k);
            const height = (c.deletedRowHeights as any)[k];
            if (!Number.isFinite(idx) || typeof height !== 'number') {
              return;
            }
            (table as any).setRowHeight(idx + (headerCount ?? 0), height);
          });
        }
      } else {
        if ((table as any).deleteRecords) {
          (table as any).deleteRecords(c.recordIndexs as any);
        }
      }

      const hasMergeSnapshot = 'oldCustomMergeCell' in c || 'newCustomMergeCell' in c;
      if (hasMergeSnapshot) {
        const target = direction === 'undo' ? (c as any).oldCustomMergeCell : (c as any).newCustomMergeCell;
        applyMergeConfig(table as any, target);

        const sg = (table as any).scenegraph;
        if (sg?.updateCellContent) {
          const prevRanges = Array.isArray((c as any).oldCustomMergeCell)
            ? ((c as any).oldCustomMergeCell as any[]).map(i => i?.range).filter(Boolean)
            : [];
          const nextRanges = Array.isArray((c as any).newCustomMergeCell)
            ? ((c as any).newCustomMergeCell as any[]).map(i => i?.range).filter(Boolean)
            : [];
          const refreshRanges = [...prevRanges, ...nextRanges];
          refreshRanges.forEach(r => {
            if (!r?.start) {
              return;
            }
            for (let col = r.start.col; col <= r.end.col; col++) {
              for (let row = r.start.row; row <= r.end.row; row++) {
                sg.updateCellContent(col, row);
              }
            }
          });
          sg.updateNextFrame?.();
        } else if (typeof (table as any).renderWithRecreateCells === 'function') {
          (table as any).renderWithRecreateCells();
        }
      }
      break;
    }
    case 'update_record': {
      const c = cmd as UpdateRecordCommand;
      if ((table as any).updateRecords) {
        if (direction === 'undo') {
          (table as any).updateRecords(c.oldRecords, c.recordIndexs as any);
        } else {
          (table as any).updateRecords(c.newRecords, c.recordIndexs as any);
        }
      }
      break;
    }
    case 'add_column': {
      const c = cmd as AddColumnCommand;
      if (direction === 'undo') {
        const deleteIndexs: number[] = [];
        for (let i = 0; i < c.columnCount; i++) {
          deleteIndexs.push(c.columnIndex + i);
        }
        (table as any).deleteColumns?.(deleteIndexs, true);
      } else {
        (table as any).addColumns?.(c.columns, c.columnIndex, true);
      }
      break;
    }
    case 'delete_column': {
      const c = cmd as DeleteColumnCommand;
      if (direction === 'undo') {
        const items = c.deleteColIndexs.map((idx, i) => ({ idx, column: c.columns[i] })).sort((a, b) => a.idx - b.idx);

        items.forEach(item => {
          (table as any).addColumns?.([item.column], item.idx, true);
        });

        if (c.deletedColWidths && typeof (table as any).setColWidth === 'function') {
          Object.entries(c.deletedColWidths).forEach(([k, width]) => {
            const idx = Number(k);
            if (!Number.isFinite(idx) || typeof width !== 'number') {
              return;
            }
            (table as any).setColWidth(idx, width);
          });
        }

        if (Array.isArray(c.deletedRecordValues) && c.deletedRecordValues.length) {
          const records = (table as any).records as any[] | undefined;
          if (Array.isArray(records) && records.length) {
            const recordIndexs: number[] = [];
            const newRecords: any[] = [];
            for (let i = 0; i < records.length; i++) {
              const rec = records[i];
              const rowValues = c.deletedRecordValues[i];
              if (!Array.isArray(rec) || !Array.isArray(rowValues) || rowValues.length !== c.deleteColIndexs.length) {
                continue;
              }
              const next = rec.slice();
              for (let k = 0; k < c.deleteColIndexs.length; k++) {
                next[c.deleteColIndexs[k]] = rowValues[k];
              }
              recordIndexs.push(i);
              newRecords.push(next);
            }
            if (recordIndexs.length) {
              (table as any).updateRecords?.(newRecords, recordIndexs, false);
            }
          }
        }

        if (c.sheetKey) {
          // updateRecords(..., trigger=false) 不会触发 vtable-sheet 的数据同步，
          // 这里主动把最新 records 同步到 formula engine，避免公式读取到旧 sheetData 导致计算为 0。
          const fm = vtableSheet?.formulaManager;
          const engine = fm?.formulaEngine;
          if (fm?.normalizeSheetData && engine?.updateSheetData) {
            try {
              const normalized = fm.normalizeSheetData((table as any).records || [], table);
              engine.updateSheetData(c.sheetKey, normalized);
            } catch {
              // ignore
            }
          }
        }

        if (c.sheetKey && c.deletedFormulas) {
          const entries = Object.entries(c.deletedFormulas);
          entries.forEach(([cellRef, formula]) => {
            const parsed = parseA1Notation(cellRef);
            if (!parsed) {
              return;
            }
            applyCellContent({
              table,
              sheetKey: c.sheetKey,
              row: parsed.row,
              col: parsed.col,
              content: formula,
              formulaManager: vtableSheet?.formulaManager
            });
          });
        }
      } else {
        (table as any).deleteColumns?.(c.deleteColIndexs, true);
      }
      break;
    }
    case 'change_header_position': {
      const c = cmd as ChangeHeaderPositionCommand;
      const moving = c.moving;
      const from = direction === 'undo' ? c.targetIndex : c.sourceIndex;
      const to = direction === 'undo' ? c.sourceIndex : c.targetIndex;
      if (moving === 'column') {
        (table as any).changeHeaderPosition?.({
          source: { col: from, row: 0 },
          target: { col: to, row: 0 },
          movingColumnOrRow: 'column'
        });
      } else {
        (table as any).changeHeaderPosition?.({
          source: { col: 0, row: from },
          target: { col: 0, row: to },
          movingColumnOrRow: 'row'
        });
      }
      break;
    }
    case 'resize_row': {
      const c = cmd as ResizeRowCommand;
      const height = direction === 'undo' ? c.oldHeight : c.newHeight;
      (table as any).setRowHeight?.(c.row, height);
      break;
    }
    case 'resize_column': {
      const c = cmd as ResizeColumnCommand;
      const width = direction === 'undo' ? c.oldWidth : c.newWidth;
      (table as any).setColWidth?.(c.col, width);
      break;
    }
    default:
      break;
  }
}
