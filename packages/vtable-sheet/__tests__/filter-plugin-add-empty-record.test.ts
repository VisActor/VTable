// @ts-nocheck
import { VTableSheet } from '../src/index';
import { createDiv, removeDom } from './dom';
import * as VTablePlugins from '../src/test-shims/vtable-plugins';

(global as any).__VERSION__ = 'none';

test('FilterPlugin only keeps empty record when blank is selected in all active filters', () => {
  const container = createDiv() as HTMLDivElement;
  container.style.position = 'relative';
  container.style.width = '1000px';
  container.style.height = '800px';

  const data = [
    ['Name', 'Age', 'City'],
    ['Alice', 24, 'Beijing'],
    ['Bob', 30, 'Shanghai'],
    ['Carol', 24, 'Beijing'],
    ['David', 32, 'Guangzhou']
  ];

  const sheet = new VTableSheet(container, {
    showFormulaBar: false,
    showSheetTab: false,
    defaultRowHeight: 25,
    defaultColWidth: 80,
    VTablePluginModules: [
      {
        module: (VTablePlugins as any).FilterPlugin,
        moduleOptions: {},
        disabled: false
      }
    ],
    sheets: [
      {
        sheetKey: 'sheet1',
        sheetTitle: 'Filter AddEmptyRecord',
        filter: true,
        data,
        active: true,
        firstRowAsHeader: true
      }
    ]
  });

  try {
    const ws = sheet.getActiveSheet();
    const table = ws.tableInstance;
    const filterPlugin =
      table?.pluginManager?.getPlugin?.('filter') ?? table?.pluginManager?.getPluginByName?.('Filter');

    const ageField = table.internalProps.layoutMap.getHeaderField(1, 0);
    const cityField = table.internalProps.layoutMap.getHeaderField(2, 0);

    filterPlugin.filterStateManager.dispatch({
      type: (VTablePlugins as any).FilterActionType.APPLY_FILTERS,
      payload: {
        field: ageField,
        type: 'byValue',
        values: [30, 32, 34],
        enable: true
      }
    });

    expect(table.getFilteredRecords().length).toBe(2);

    const emptyRecord: any[] = [];
    table.addRecord(emptyRecord, 2, true);
    expect(table.getFilteredRecords().includes(emptyRecord)).toBe(true);

    filterPlugin.filterStateManager.dispatch({
      type: (VTablePlugins as any).FilterActionType.APPLY_FILTERS,
      payload: {
        field: cityField,
        type: 'byValue',
        values: ['Chongqing', 'Guangzhou', 'Shanghai', 'Shenzhen'],
        enable: true
      }
    });

    expect(table.getFilteredRecords().includes(emptyRecord)).toBe(false);

    emptyRecord[0] = 'New Name';

    filterPlugin.filterStateManager.dispatch({
      type: (VTablePlugins as any).FilterActionType.APPLY_FILTERS,
      payload: {
        field: cityField,
        type: 'byValue',
        values: [undefined, 'Chongqing', 'Guangzhou', 'Shanghai', 'Shenzhen'],
        enable: true
      }
    });

    filterPlugin.filterStateManager.dispatch({
      type: (VTablePlugins as any).FilterActionType.APPLY_FILTERS,
      payload: {
        field: ageField,
        type: 'byValue',
        values: [undefined, 30, 32, 34],
        enable: true
      }
    });

    expect(table.getFilteredRecords().includes(emptyRecord)).toBe(true);
  } finally {
    sheet.release();
    removeDom(container);
  }
});
