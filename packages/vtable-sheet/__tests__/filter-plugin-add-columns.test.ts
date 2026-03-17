// @ts-nocheck
import { VTableSheet } from '../src/index';
import { createDiv, removeDom } from './dom';
import * as VTablePlugins from '../src/test-shims/vtable-plugins';

(global as any).__VERSION__ = 'none';

test('FilterPlugin keeps existing value filters working after addColumns insertion', () => {
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
        sheetTitle: 'Filter AddColumns',
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

    const cityField = table.internalProps.layoutMap.getHeaderField(2, 0);

    filterPlugin.filterStateManager.dispatch({
      type: (VTablePlugins as any).FilterActionType.APPLY_FILTERS,
      payload: {
        field: cityField,
        type: 'byValue',
        values: ['Beijing'],
        enable: true
      }
    });

    expect(table.getFilteredRecords().length).toBe(2);

    table.addColumns(
      [
        {
          field: 2,
          title: 'New Column 2',
          width: 100
        }
      ],
      2,
      true
    );

    const ageFieldAfter = table.internalProps.layoutMap.getHeaderField(1, 0);

    filterPlugin.filterStateManager.dispatch({
      type: (VTablePlugins as any).FilterActionType.APPLY_FILTERS,
      payload: {
        field: ageFieldAfter,
        type: 'byValue',
        values: [24],
        enable: true
      }
    });

    expect(table.getFilteredRecords().length).toBe(2);
  } finally {
    sheet.release();
    removeDom(container);
  }
});
