import * as VTable from '../../src';

/** 多个跨冻结边界的合并区域分别截断阴影，普通行继续显示默认阴影。 */
export function createTable() {
  const container = document.getElementById('vTable');
  container.style.width = '900px';
  container.style.height = '480px';
  const columns = Array.from({ length: 8 }, (_, col) => ({
    field: `c${col}`,
    title: `Column ${col + 1}`,
    width: 160
  }));
  const records = Array.from({ length: 14 }, (_, row) =>
    Object.fromEntries(columns.map((column, col) => [column.field, `R${row + 1} / C${col + 1}`]))
  );
  const table = new VTable.ListTable(container, {
    columns,
    records,
    frozenColCount: 2,
    rightFrozenColCount: 1,
    bottomFrozenRowCount: 1,
    theme: VTable.themes.DEFAULT.extends({
      frozenColumnLine: { shadow: { skipMergedCells: true } }
    }),
    customMergeCell: (col, row, instance) => {
      const firstRow = row === 3 ? 3 : row >= 6 && row <= 7 ? 6 : instance.rowCount - 1;
      const lastRow = firstRow === 6 ? 7 : firstRow;
      if (row < firstRow || row > lastRow) {
        return;
      }
      return {
        text: firstRow === 3 ? 'Merged A' : firstRow === 6 ? 'Merged B (two rows)' : 'Frozen summary',
        range: { start: { col: 0, row: firstRow }, end: { col: instance.colCount - 1, row: lastRow } }
      };
    }
  });
  window.tableInstance = table;
}
