import type { ListTable, TYPES } from '@visactor/vtable';

export interface SnapshotState {
  prevColumnsSnapshot: TYPES.ColumnDefine[] | null;
  prevMergeSnapshot: TYPES.CustomMergeCellArray | undefined;
  prevRecordsSnapshot: any[] | null;
  prevFormulasSnapshot?: Record<string, string> | null;
  prevResizedRowHeightsSnapshot?: Record<number, number> | null;
  prevResizedColWidthsSnapshot?: Record<number, number> | null;
}

// 轻量深拷贝：用于把 VTable 的 columns 配置快照化，避免撤销时被后续原地修改污染。
export function cloneDeep<T>(input: T, cache: WeakMap<object, any> = new WeakMap()): T {
  if (input === null || input === undefined) {
    return input;
  }
  const t = typeof input;
  if (t === 'function' || t !== 'object') {
    return input;
  }
  const obj = input as any;
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj) as any;
  }
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  if (Array.isArray(obj)) {
    const arr: any[] = [];
    cache.set(obj, arr);
    for (let i = 0; i < obj.length; i++) {
      arr[i] = cloneDeep(obj[i], cache);
    }
    return arr as any;
  }
  const out: Record<string, any> = {};
  cache.set(obj, out);
  Object.keys(obj).forEach(key => {
    out[key] = cloneDeep(obj[key], cache);
  });
  return out as any;
}

export function captureSnapshot(
  table: ListTable,
  state: SnapshotState,
  options?: { formulaManager?: any; sheetKey?: string }
): void {
  const tableOptions: any = table.options || {};

  // columns / merge / records 都是“下一次事件”的变更前状态来源，必须快照化。
  const columns = tableOptions.columns as TYPES.ColumnDefine[] | undefined;
  if (Array.isArray(columns)) {
    state.prevColumnsSnapshot = columns.map(c => cloneDeep(c));
  } else {
    state.prevColumnsSnapshot = null;
  }

  const merge = tableOptions.customMergeCell as TYPES.CustomMergeCellArray | undefined;
  if (Array.isArray(merge)) {
    state.prevMergeSnapshot = merge.map(m => ({
      ...m,
      range: {
        start: { ...m.range.start },
        end: { ...m.range.end }
      }
    }));
  } else {
    state.prevMergeSnapshot = merge;
  }

  const records = (table.records || []) as any[];
  if (Array.isArray(records)) {
    state.prevRecordsSnapshot = records.map(r => cloneRecord(r));
  } else {
    state.prevRecordsSnapshot = null;
  }

  try {
    const resizedRowIndexs = Array.from((table as any).internalProps?._heightResizedRowMap?.keys?.() ?? []);
    if (resizedRowIndexs.length && typeof (table as any).getRowHeight === 'function') {
      const map: Record<number, number> = {};
      resizedRowIndexs.forEach((rowIndex: any) => {
        if (typeof rowIndex !== 'number') {
          return;
        }
        const h = (table as any).getRowHeight(rowIndex);
        if (typeof h === 'number') {
          map[rowIndex] = h;
        }
      });
      state.prevResizedRowHeightsSnapshot = map;
    } else {
      state.prevResizedRowHeightsSnapshot = null;
    }
  } catch {
    state.prevResizedRowHeightsSnapshot = null;
  }

  try {
    const resizedColIndexs = Array.from((table as any).internalProps?._widthResizedColMap?.keys?.() ?? []);
    if (resizedColIndexs.length && typeof (table as any).getColWidth === 'function') {
      const map: Record<number, number> = {};
      resizedColIndexs.forEach((colIndex: any) => {
        if (typeof colIndex !== 'number') {
          return;
        }
        const w = (table as any).getColWidth(colIndex);
        if (typeof w === 'number') {
          map[colIndex] = w;
        }
      });
      state.prevResizedColWidthsSnapshot = map;
    } else {
      state.prevResizedColWidthsSnapshot = null;
    }
  } catch {
    state.prevResizedColWidthsSnapshot = null;
  }

  // 仅在 vtable-sheet 场景下可用：用于删除列撤销时恢复公式关系。
  if (options?.formulaManager?.exportFormulas && options.sheetKey) {
    try {
      const formulas = options.formulaManager.exportFormulas(options.sheetKey);
      state.prevFormulasSnapshot = formulas ? { ...formulas } : null;
    } catch {
      state.prevFormulasSnapshot = null;
    }
  } else {
    state.prevFormulasSnapshot = null;
  }
}

export function cloneRecord(record: any): any {
  if (Array.isArray(record)) {
    return record.slice();
  }
  if (record && typeof record === 'object') {
    return { ...record };
  }
  return record;
}
