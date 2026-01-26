/**
 * Convert A1 notation to column index (0-based)
 * @param colStr Column string (e.g., 'A', 'B', 'AA')
 * @returns Column index (0-based)
 */
export function columnStringToIndex(colStr: string): number {
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  return col - 1;
}

/**
 * Convert column index to A1 notation string
 * @param colIndex Column index (0-based)
 * @returns Column string (e.g., 'A', 'B', 'AA')
 */
export function columnIndexToString(colIndex: number): string {
  let colStr = '';
  let tempCol = colIndex + 1;

  do {
    tempCol -= 1;
    colStr = String.fromCharCode(65 + (tempCol % 26)) + colStr;
    tempCol = Math.floor(tempCol / 26);
  } while (tempCol > 0);

  return colStr;
}

/**
 * Convert sheet data to VTable records format
 * @param data Sheet data (2D array)
 * @returns VTable records format
 */
export function dataToRecords(data: any[][]): any[] {
  if (!data || !data.length) {
    return [];
  }

  const records = [];
  const headerRow = data[0];

  // Skip header row if it exists
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const record: Record<string, any> = {};

    for (let j = 0; j < row.length; j++) {
      // Use header row values as field names if available, otherwise use column index
      const fieldName = headerRow && j < headerRow.length ? headerRow[j] : j.toString();
      record[fieldName] = row[j];
    }

    records.push(record);
  }

  return records;
}

/**
 * Convert VTable records format to sheet data (2D array)
 * @param records VTable records
 * @param columns VTable columns definition
 * @returns Sheet data (2D array)
 */
export function recordsToData(records: any[], columns: any[]): any[][] {
  if (!records || !records.length) {
    return [];
  }

  const data: any[][] = [];

  // Add header row based on column definitions
  const headerRow = columns.map(col => col.title || col.field);
  data.push(headerRow);

  // Add data rows
  for (const record of records) {
    const row = columns.map(col => record[col.field]);
    data.push(row);
  }

  return data;
}

/**
 * 若所选范围包含当前正在编辑的单元格，自动排除该单元格以避免 #CYCLE!
 */
export function excludeEditCellFromSelection(
  range: { startRow: number; startCol: number; endRow: number; endCol: number },
  editRow: number,
  editCol: number
) {
  const r = { ...range };
  const withinRow = r.startRow <= editRow && editRow <= r.endRow;
  const withinCol = r.startCol <= editCol && editCol <= r.endCol;
  if (!withinRow || !withinCol) {
    return r;
  }

  const rowSpan = r.endRow - r.startRow;
  const colSpan = r.endCol - r.startCol;

  // 如果选择范围就是编辑单元格本身，返回空范围（表示无效选择）
  if (rowSpan === 0 && colSpan === 0 && r.startRow === editRow && r.startCol === editCol) {
    return { startRow: -1, startCol: -1, endRow: -1, endCol: -1 };
  }

  if (rowSpan >= colSpan) {
    // 优先在行方向上排除编辑单元格
    if (editRow === r.startRow && r.startRow < r.endRow) {
      r.startRow += 1;
    } else if (editRow === r.endRow && r.startRow < r.endRow) {
      r.endRow -= 1;
    } else if (r.startRow < r.endRow) {
      r.startRow += 1;
    } // 中间，默认从起点缩一格
  } else {
    // 优先在列方向上排除编辑单元格
    if (editCol === r.startCol && r.startCol < r.endCol) {
      r.startCol += 1;
    } else if (editCol === r.endCol && r.startCol < r.endCol) {
      r.endCol -= 1;
    } else if (r.startCol < r.endCol) {
      r.startCol += 1;
    }
  }
  return r;
}
