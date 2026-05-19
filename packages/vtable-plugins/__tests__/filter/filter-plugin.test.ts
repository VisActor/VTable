// @ts-nocheck
let subscribeCallback: ((state: any, action?: any) => void) | undefined;

jest.mock('@visactor/vtable', () => ({
  TABLE_EVENT_TYPE: {
    BEFORE_INIT: 'before_init',
    BEFORE_UPDATE_OPTION: 'before_update_option',
    ICON_CLICK: 'icon_click',
    SCROLL: 'scroll',
    CHANGE_CELL_VALUE: 'change_cell_value',
    UPDATE_RECORD: 'update_record',
    ADD_RECORD: 'add_record',
    DELETE_RECORD: 'delete_record',
    ADD_COLUMN: 'add_column',
    DELETE_COLUMN: 'delete_column'
  },
  TYPES: {
    IconPosition: {
      right: 'right'
    }
  }
}));

jest.mock('../../src/filter/filter-engine', () => ({
  FilterEngine: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../src/filter/filter-state-manager', () => ({
  FilterStateManager: jest.fn().mockImplementation(() => ({
    subscribe: (cb: (state: any, action?: any) => void) => {
      subscribeCallback = cb;
    },
    getFilterState: () => undefined,
    getActiveFilterFields: () => [],
    reapplyCurrentFilters: jest.fn(),
    dispatch: jest.fn()
  }))
}));

jest.mock('../../src/filter/filter-toolbar', () => ({
  FilterToolbar: jest.fn().mockImplementation(() => ({
    render: jest.fn(),
    updateStyles: jest.fn(),
    isVisible: false,
    hide: jest.fn(),
    show: jest.fn(),
    adjustMenuPosition: jest.fn(),
    valueFilter: {
      syncSingleStateFromTableData: jest.fn()
    }
  }))
}));

const { FilterPlugin } = require('../../src/filter/filter');

describe('FilterPlugin', () => {
  beforeEach(() => {
    subscribeCallback = undefined;
  });

  test('uses current table column order when filter state updates', () => {
    const staleColumns = [
      { field: 'a', title: 'A' },
      { field: 'b', title: 'B' },
      { field: 'c', title: 'C' }
    ];
    const currentColumns = [
      { field: 'a', title: 'A' },
      { field: 'c', title: 'C' },
      { field: 'b', title: 'B' }
    ];
    const table = {
      isListTable: () => true,
      updateColumns: jest.fn(),
      get columns() {
        return currentColumns;
      }
    };

    const plugin = new FilterPlugin({});
    plugin.table = table;
    plugin.initFilterPlugin({
      options: {
        columns: staleColumns
      }
    });

    subscribeCallback?.({}, { type: 'apply_filters' });

    expect(table.updateColumns).toHaveBeenCalledWith(currentColumns, {
      clearRowHeightCache: false
    });
  });
});
