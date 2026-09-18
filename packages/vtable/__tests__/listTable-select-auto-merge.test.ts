// @ts-nocheck
import { ListTable } from '../src';
import { createDiv, removeDom } from './dom';

global.__VERSION__ = 'none';

const columns = Array.from({ length: 6 }, (_, index) => ({
  field: `f${index}`,
  title: `F${index}`,
  width: 120
}));

const records = Array.from({ length: 8 }, (_, rowIndex) => {
  const record = {};
  columns.forEach((column, columnIndex) => {
    record[column.field] = `r${rowIndex}-c${columnIndex}`;
  });
  return record;
});

describe('listTable select auto merge ranges', () => {
  const tables: ListTable[] = [];
  const containers: HTMLElement[] = [];

  function createTable(select = {}, extraOptions = {}) {
    const container = createDiv();
    container.style.position = 'relative';
    container.style.width = '900px';
    container.style.height = '600px';

    const table = new ListTable({
      container,
      columns,
      records,
      defaultColWidth: 120,
      select,
      ...extraOptions
    });

    tables.push(table);
    containers.push(container);
    return table;
  }

  function getMainBodyCell(table: ListTable, colOffset = 0, rowOffset = 0) {
    return {
      col: Math.max(table.rowHeaderLevelCount + table.leftRowSeriesNumberCount, table.frozenColCount) + colOffset,
      row: Math.max(table.columnHeaderLevelCount, table.frozenRowCount) + rowOffset
    };
  }

  function addSkipBodyMerge(range) {
    return {
      start: { ...range.start },
      end: { ...range.end },
      skipBodyMerge: true
    };
  }

  function cloneRanges(ranges) {
    return ranges.map(range => ({
      start: { ...range.start },
      end: { ...range.end },
      ...(range.skipBodyMerge ? { skipBodyMerge: true } : {})
    }));
  }

  function dragSelect(table: ListTable, start, end, enableCtrlSelectMode = false) {
    table.stateManager.updateSelectPos(start.col, start.row, false, enableCtrlSelectMode, false, false, true);
    table.stateManager.updateInteractionState('grabing');
    table.stateManager.updateSelectPos(end.col, end.row, false, enableCtrlSelectMode, false, false, true);
    table.stateManager.endSelectCells(true, false);
    table.stateManager.updateInteractionState('default');
  }

  afterEach(() => {
    tables.splice(0).forEach(table => table.release());
    containers.splice(0).forEach(container => removeDom(container));
  });

  test('keeps the original multi-range result when auto merge is disabled', () => {
    const table = createTable();
    const start = getMainBodyCell(table, 1, 1);

    table.selectCells([
      { start, end: { col: start.col + 1, row: start.row + 1 } },
      { start: { col: start.col + 2, row: start.row }, end: { col: start.col + 3, row: start.row + 1 } }
    ]);

    expect(table.getSelectedCellRanges()).toEqual([
      addSkipBodyMerge({ start, end: { col: start.col + 1, row: start.row + 1 } }),
      addSkipBodyMerge({
        start: { col: start.col + 2, row: start.row },
        end: { col: start.col + 3, row: start.row + 1 }
      })
    ]);
  });

  test('merges adjacent and overlapping body ranges into a single rectangle', () => {
    const table = createTable({ autoMergeRanges: true });
    const start = getMainBodyCell(table, 1, 1);

    table.selectCells([
      { start, end: { col: start.col + 1, row: start.row + 1 } },
      { start: { col: start.col + 2, row: start.row }, end: { col: start.col + 3, row: start.row + 1 } }
    ]);

    expect(table.getSelectedCellRanges()).toEqual([
      addSkipBodyMerge({
        start,
        end: { col: start.col + 3, row: start.row + 1 }
      })
    ]);

    table.selectCells([
      { start, end: { col: start.col + 2, row: start.row + 1 } },
      { start: { col: start.col + 1, row: start.row }, end: { col: start.col + 3, row: start.row + 1 } }
    ]);

    expect(table.getSelectedCellRanges()).toEqual([
      addSkipBodyMerge({
        start,
        end: { col: start.col + 3, row: start.row + 1 }
      })
    ]);
  });

  test.each([
    {
      name: 'L-shaped ranges',
      ranges: start => [
        { start, end: start },
        { start: { col: start.col + 1, row: start.row }, end: { col: start.col + 1, row: start.row } },
        { start: { col: start.col, row: start.row + 1 }, end: { col: start.col, row: start.row + 1 } }
      ]
    },
    {
      name: 'ranges with a hole',
      ranges: start => [
        { start, end: { col: start.col + 2, row: start.row } },
        { start: { col: start.col, row: start.row + 1 }, end: { col: start.col, row: start.row + 2 } },
        {
          start: { col: start.col + 2, row: start.row + 1 },
          end: { col: start.col + 2, row: start.row + 2 }
        },
        { start: { col: start.col + 1, row: start.row + 2 }, end: { col: start.col + 1, row: start.row + 2 } }
      ]
    },
    {
      name: 'disconnected ranges',
      ranges: start => [
        { start, end: { col: start.col + 1, row: start.row } },
        { start: { col: start.col + 3, row: start.row }, end: { col: start.col + 4, row: start.row } }
      ]
    }
  ])('keeps multiple ranges for $name', ({ ranges }) => {
    const table = createTable({ autoMergeRanges: true });
    const start = getMainBodyCell(table, 1, 1);
    const selectedRanges = ranges(start);

    table.selectCells(selectedRanges);

    expect(table.getSelectedCellRanges()).toEqual(selectedRanges.map(addSkipBodyMerge));
  });

  test('uses the merged ranges for ctrl multi-select and selected_cell events', () => {
    const table = createTable({ autoMergeRanges: true });
    const start = getMainBodyCell(table, 1, 1);
    const selectedEvents = [];

    table.on('selected_cell', event => {
      selectedEvents.push(cloneRanges(event.ranges));
    });

    table.selectCell(start.col, start.row, false, false, false, true);
    table.selectCell(start.col + 1, start.row, false, true, false, true);

    const expectedRange = addSkipBodyMerge({
      start,
      end: { col: start.col + 1, row: start.row }
    });

    expect(table.getSelectedCellRanges()).toEqual([expectedRange]);
    expect(selectedEvents[selectedEvents.length - 1]).toEqual([expectedRange]);
  });

  test('uses the same merge logic for drag multi-select', () => {
    const table = createTable({ autoMergeRanges: true });
    const start = getMainBodyCell(table, 1, 1);

    dragSelect(table, start, { col: start.col + 1, row: start.row });
    dragSelect(table, { col: start.col + 2, row: start.row }, { col: start.col + 3, row: start.row }, true);

    expect(table.getSelectedCellRanges()).toEqual([
      addSkipBodyMerge({
        start,
        end: { col: start.col + 3, row: start.row }
      })
    ]);
  });

  test('does not merge ranges across frozen body partitions', () => {
    const table = createTable({ autoMergeRanges: true }, { frozenColCount: 2 });
    const row = getMainBodyCell(table, 0, 1).row;

    table.selectCells([
      {
        start: { col: table.frozenColCount - 1, row },
        end: { col: table.frozenColCount - 1, row }
      },
      {
        start: { col: table.frozenColCount, row },
        end: { col: table.frozenColCount, row }
      }
    ]);

    expect(table.getSelectedCellRanges()).toEqual([
      addSkipBodyMerge({
        start: { col: table.frozenColCount - 1, row },
        end: { col: table.frozenColCount - 1, row }
      }),
      addSkipBodyMerge({
        start: { col: table.frozenColCount, row },
        end: { col: table.frozenColCount, row }
      })
    ]);
  });
});
