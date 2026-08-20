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

  test('ContextMenuPlugin emits context_menu_click after menu item click', () => {
    const container = createDiv();
    const contextMenuPlugin = new ContextMenuPlugin();

    table = new ListTable({
      container,
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' }
      ],
      records: [{ id: 1, name: 'Alice' }],
      plugins: [contextMenuPlugin]
    });

    const fireListeners = jest.spyOn(table, 'fireListeners');

    contextMenuPlugin['handleMenuClickCallback'](
      {
        menuKey: 'freeze_to_this_row_and_column',
        menuText: '冻结到本行本列',
        rowIndex: 1,
        colIndex: 0
      },
      table
    );

    expect(table.frozenRowCount).toBe(2);
    expect(table.frozenColCount).toBe(1);
    expect(fireListeners).toHaveBeenCalledWith(ListTable.EVENT_TYPE.CONTEXT_MENU_CLICK, {
      col: 0,
      row: 1,
      contextMenu: {
        menuKey: 'freeze_to_this_row_and_column',
        menuText: '冻结到本行本列',
        rowIndex: 1,
        colIndex: 0,
        cellValue: 1
      }
    });
  });

  test('ContextMenuPlugin emits the right-click cell value after a row deletion menu action', () => {
    const container = createDiv();
    const contextMenuPlugin = new ContextMenuPlugin({
      bodyCellMenuItems: [{ text: '删除行', menuKey: 'delete_row' }]
    });

    table = new ListTable({
      container,
      columns: [
        { field: 'id', title: 'ID' },
        { field: 'name', title: 'Name' }
      ],
      records: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ],
      syncRecordOperationsToSourceRecords: true,
      plugins: [contextMenuPlugin]
    });

    table.stateManager.select.ranges = [
      {
        start: { col: 0, row: 1 },
        end: { col: 0, row: 1 }
      }
    ];
    const showMenu = jest.spyOn(contextMenuPlugin['menuManager'], 'showMenu');
    const fireListeners = jest.spyOn(table, 'fireListeners');

    contextMenuPlugin.run(
      {
        col: 0,
        row: 1,
        event: {
          clientX: 10,
          clientY: 20,
          preventDefault: jest.fn()
        }
      },
      ListTable.EVENT_TYPE.CONTEXTMENU_CELL,
      table
    );

    const contextSnapshot = showMenu.mock.calls[0][3];
    expect(contextSnapshot.cellValue).toBe(1);

    contextMenuPlugin['handleMenuClickCallback'](
      {
        menuKey: 'delete_row',
        menuText: '删除行',
        ...contextSnapshot
      },
      table
    );

    expect(table.records.map(record => record.id)).toEqual([2]);
    expect(fireListeners).toHaveBeenCalledWith(ListTable.EVENT_TYPE.CONTEXT_MENU_CLICK, {
      col: 0,
      row: 1,
      contextMenu: {
        menuKey: 'delete_row',
        menuText: '删除行',
        rowIndex: 1,
        colIndex: 0,
        cellValue: 1
      }
    });
  });

  test('ContextMenuPlugin preserves null and undefined cell value snapshots', () => {
    const container = createDiv();
    const contextMenuPlugin = new ContextMenuPlugin({
      menuClickCallback: jest.fn()
    });

    table = new ListTable({
      container,
      columns: [{ field: 'id', title: 'ID' }],
      records: [{ id: 1 }],
      plugins: [contextMenuPlugin]
    });

    const getCellValue = jest.spyOn(table, 'getCellValue');
    const fireListeners = jest.spyOn(table, 'fireListeners');

    contextMenuPlugin['handleMenuClickCallback'](
      {
        menuKey: 'custom_null',
        menuText: 'Null Value',
        rowIndex: 1,
        colIndex: 0,
        cellValue: null
      },
      table
    );
    contextMenuPlugin['handleMenuClickCallback'](
      {
        menuKey: 'custom_undefined',
        menuText: 'Undefined Value',
        rowIndex: 1,
        colIndex: 0,
        cellValue: undefined
      },
      table
    );

    expect(getCellValue).not.toHaveBeenCalled();
    expect(fireListeners).toHaveBeenCalledWith(ListTable.EVENT_TYPE.CONTEXT_MENU_CLICK, {
      col: 0,
      row: 1,
      contextMenu: {
        menuKey: 'custom_null',
        menuText: 'Null Value',
        rowIndex: 1,
        colIndex: 0,
        cellValue: null
      }
    });
    expect(fireListeners).toHaveBeenCalledWith(ListTable.EVENT_TYPE.CONTEXT_MENU_CLICK, {
      col: 0,
      row: 1,
      contextMenu: {
        menuKey: 'custom_undefined',
        menuText: 'Undefined Value',
        rowIndex: 1,
        colIndex: 0,
        cellValue: undefined
      }
    });
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

  test('PluginManager only releases plugins removed through updateOption', () => {
    const container = createDiv();
    const removedPlugin = {
      id: 'removed-plugin',
      name: 'removed-plugin',
      runTime: [],
      run: jest.fn(),
      release: jest.fn()
    };
    const keptPlugin = {
      id: 'kept-plugin',
      name: 'kept-plugin',
      runTime: [],
      run: jest.fn(),
      release: jest.fn()
    };

    table = new ListTable({
      container,
      columns: [{ field: 'id', title: 'ID' }],
      records: [{ id: 1 }],
      plugins: [removedPlugin, keptPlugin]
    });

    table.updateOption({
      container,
      columns: [{ field: 'id', title: 'ID' }],
      records: [{ id: 1 }],
      plugins: [keptPlugin]
    });

    expect(removedPlugin.release).toHaveBeenCalledTimes(1);
    expect(keptPlugin.release).not.toHaveBeenCalled();
  });
});
