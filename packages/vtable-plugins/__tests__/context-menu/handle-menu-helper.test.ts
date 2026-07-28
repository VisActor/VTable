// @ts-nocheck
import { ListTable } from '@visactor/vtable';
import { createDiv } from '../../../vtable/__tests__/dom';
import { ContextMenuPlugin } from '../../src/context-menu';
import { MenuHandler } from '../../src/contextmenu/handle-menu-helper';
import { TableSeriesNumber } from '../../src/table-series-number';

global.__VERSION__ = 'none';

describe('Context menu row deletion', () => {
  let table: ListTable;

  afterEach(() => {
    table?.release();
    document.body.innerHTML = '';
  });

  test('deletes all rows in a reverse-dragged row selection', () => {
    const container = createDiv();
    container.style.width = '600px';
    container.style.height = '400px';

    const seriesNumberPlugin = new TableSeriesNumber({
      rowCount: 5,
      colCount: 2
    });
    table = new ListTable({
      container,
      showHeader: false,
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' }
      ],
      records: [
        { id: 0, name: 'A' },
        { id: 1, name: 'B' },
        { id: 2, name: 'C' },
        { id: 3, name: 'D' },
        { id: 4, name: 'E' }
      ],
      syncRecordOperationsToSourceRecords: true,
      plugins: [seriesNumberPlugin]
    });

    table.stateManager.select.ranges = [
      {
        start: { col: 0, row: 3 },
        end: { col: table.colCount - 1, row: 1 }
      }
    ];

    const selectCells = jest.spyOn(table, 'selectCells');
    seriesNumberPlugin['handleSeriesNumberCellRightClick']({
      detail: {
        seriesNumberCell: { id: 2, name: 'row-series-number-cell' },
        event: new MouseEvent('contextmenu')
      }
    });

    expect(selectCells).not.toHaveBeenCalled();

    new MenuHandler().handleDeleteRow(table);

    expect(table.records.map(record => record.id)).toEqual([0, 4]);
  });
});

describe('Context menu canvas option', () => {
  let table: ListTable;

  afterEach(() => {
    table?.release();
    document.body.innerHTML = '';
  });

  test('ContextMenuPlugin enables canvas context menu through contextMenuWorkOnlyCell', () => {
    const container = createDiv();
    const contextMenuPlugin = new ContextMenuPlugin({
      contextMenuWorkOnlyCell: false
    });

    table = new ListTable({
      container,
      columns: [{ field: 'id', title: 'ID' }],
      records: [{ id: 1 }],
      plugins: [contextMenuPlugin]
    });

    expect(table.options.menu.contextMenuWorkOnlyCell).toBe(false);
    expect(contextMenuPlugin.runTime).toContain(ListTable.EVENT_TYPE.CONTEXTMENU_CANVAS);
  });

  test('ContextMenuPlugin shows canvasMenuItems on CONTEXTMENU_CANVAS event', () => {
    const container = createDiv();
    const contextMenuPlugin = new ContextMenuPlugin({
      contextMenuWorkOnlyCell: false,
      bodyCellMenuItems: [{ text: 'Body Item', menuKey: 'body_item' }],
      canvasMenuItems: [{ text: 'Canvas Item', menuKey: 'canvas_item' }]
    });
    const showMenu = jest.spyOn(contextMenuPlugin['menuManager'], 'showMenu');
    const preventDefault = jest.fn();

    table = new ListTable({
      container,
      columns: [{ field: 'id', title: 'ID' }],
      records: [{ id: 1 }],
      plugins: [contextMenuPlugin]
    });

    contextMenuPlugin.run(
      {
        col: -1,
        row: -1,
        event: {
          clientX: 10,
          clientY: 20,
          preventDefault
        }
      },
      ListTable.EVENT_TYPE.CONTEXTMENU_CANVAS,
      table
    );

    expect(preventDefault).toHaveBeenCalled();
    expect(showMenu).toHaveBeenCalledWith(
      [{ text: 'Canvas Item', menuKey: 'canvas_item' }],
      10,
      20,
      {
        rowIndex: -1,
        colIndex: -1
      },
      table
    );
  });

  test('ContextMenuPlugin init uses new options when added through updateOption', () => {
    const container = createDiv();
    const contextMenuPlugin = new ContextMenuPlugin({
      contextMenuWorkOnlyCell: false
    });

    table = new ListTable({
      container,
      columns: [{ field: 'id', title: 'ID' }],
      records: [{ id: 1 }]
    });

    table.updateOption({
      container,
      columns: [{ field: 'id', title: 'ID' }],
      records: [{ id: 1 }],
      plugins: [contextMenuPlugin]
    });

    expect(table.options.menu.contextMenuWorkOnlyCell).toBe(false);
  });
});
