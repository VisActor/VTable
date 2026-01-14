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
