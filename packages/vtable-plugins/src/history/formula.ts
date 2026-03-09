import type { ListTable } from '@visactor/vtable';

export function makeCellKey(sheetKey: string, row: number, col: number): string {
  return `${sheetKey}:${row}:${col}`;
}

// 将 A1 单元格引用（如 "B5"）解析成 0-based 行列索引。
export function parseA1Notation(a1: string): { row: number; col: number } | null {
  const match = a1.match(/^([A-Z]+)([0-9]+)$/i);
  if (!match) {
    return null;
  }
  const letters = match[1].toUpperCase();
  const rowNumber = parseInt(match[2], 10);
  if (!rowNumber || rowNumber < 1) {
    return null;
  }
  let col = 0;
  for (let i = 0; i < letters.length; i++) {
    col = col * 26 + (letters.charCodeAt(i) - 64);
  }
  return { row: rowNumber - 1, col: col - 1 };
}

export function captureCellPreChangeContent(args: {
  sheetKey: string | undefined;
  row: number;
  col: number;
  currentValue: any;
  formulaManager: any;
  store: Map<string, any>;
}): void {
  const { sheetKey, row, col, currentValue, formulaManager, store } = args;
  if (!sheetKey) {
    return;
  }
  const cellKey = makeCellKey(sheetKey, row, col);

  // 对公式单元格优先记录公式字符串（而不是显示值），确保撤销能恢复“公式关系”。
  if (formulaManager?.getCellFormula) {
    try {
      const oldFormula = formulaManager.getCellFormula({ sheet: sheetKey, row, col });
      if (oldFormula) {
        const normalized =
          typeof oldFormula === 'string' && !oldFormula.startsWith('=') ? `=${oldFormula}` : oldFormula;
        store.set(cellKey, normalized);
        return;
      }
    } catch {
      // ignore
    }
  }

  store.set(cellKey, currentValue == null ? '' : currentValue);
}

export function popCellPreChangeContent(args: {
  sheetKey: string | undefined;
  row: number;
  col: number;
  fallbackOldContent: any;
  store: Map<string, any>;
}): any {
  const { sheetKey, row, col, fallbackOldContent, store } = args;
  if (!sheetKey) {
    return fallbackOldContent;
  }
  const cellKey = makeCellKey(sheetKey, row, col);
  const oldContent = store.get(cellKey);
  store.delete(cellKey);
  return typeof oldContent !== 'undefined' ? oldContent : fallbackOldContent;
}

export function applyCellContent(args: {
  table: ListTable;
  sheetKey: string | undefined;
  row: number;
  col: number;
  content: any;
  formulaManager: any;
}): void {
  const { table, sheetKey, row, col, content, formulaManager } = args;

  if (sheetKey && formulaManager?.setCellContent && formulaManager?.getCellValue) {
    // 优先写入 formula engine：写入公式后再把显示值同步回 table。
    try {
      formulaManager.setCellContent({ sheet: sheetKey, row, col }, content);
    } catch {
      table.changeCellValue(col, row, content, false, false, true);
      return;
    }

    const isFormula = typeof content === 'string' && content.startsWith('=');
    if (isFormula) {
      const result = formulaManager.getCellValue({ sheet: sheetKey, row, col });
      const display = result?.error ? '#ERROR!' : result?.value;
      table.changeCellValue(col, row, display, false, false, true);
      refreshDependentDisplays({ table, sheetKey, startCell: { sheet: sheetKey, row, col }, formulaManager });
      return;
    }

    table.changeCellValue(col, row, content, false, false, true);
    refreshDependentDisplays({ table, sheetKey, startCell: { sheet: sheetKey, row, col }, formulaManager });
    return;
  }

  table.changeCellValue(col, row, content, false, false, true);
}

export function refreshDependentDisplays(args: {
  table: ListTable;
  sheetKey: string;
  startCell: { sheet: string; row: number; col: number };
  formulaManager: any;
  maxCells?: number;
}): void {
  const { table, sheetKey, startCell, formulaManager } = args;
  const maxCells = args.maxCells ?? 5000;

  if (!formulaManager?.getCellDependents || !formulaManager?.getCellValue) {
    return;
  }

  const visited = new Set<string>();
  const queue = [...(formulaManager.getCellDependents(startCell) || [])];
  let processed = 0;

  while (queue.length) {
    const cell = queue.shift();
    if (!cell || cell.sheet !== sheetKey) {
      continue;
    }
    const key = makeCellKey(cell.sheet, cell.row, cell.col);
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);
    processed++;
    if (processed > maxCells) {
      break;
    }

    const result = formulaManager.getCellValue(cell);
    const display = result?.error ? '#ERROR!' : result?.value;
    table.changeCellValue(cell.col, cell.row, display, false, false, true);

    const deps = formulaManager.getCellDependents(cell) || [];
    deps.forEach((d: any) => queue.push(d));
  }
}
