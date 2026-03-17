// @ts-nocheck
import { VTableSheet } from '../src/index';
import { createDiv, removeDom } from './dom';
import * as VTablePlugins from '../src/test-shims/vtable-plugins';

(global as any).__VERSION__ = 'none';

test('Value filter selection remains after editing cell in inserted empty record', async () => {
  const container = createDiv() as HTMLDivElement;
  container.style.position = 'relative';
  container.style.width = '1000px';
  container.style.height = '800px';

  const data = [
    ['Name', 'Age', 'City'],
    ['Alice', 24, 'Beijing'],
    ['Bob', 30, 'Shanghai'],
    ['Carol', 28, 'Shenzhen'],
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
        sheetTitle: 'Filter Edit Keeps Selection',
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

    filterPlugin.filterStateManager.dispatch({
      type: (VTablePlugins as any).FilterActionType.APPLY_FILTERS,
      payload: {
        field: ageField,
        type: 'byValue',
        values: [24, 32],
        enable: true
      }
    });

    expect(filterPlugin.filterStateManager.getFilterState(ageField).values).toEqual([24, 32]);

    const emptyRecord: any[] = [];
    table.addRecord(emptyRecord, 2, true);

    const row = table.getBodyRowIndexByRecordIndex(2) + table.columnHeaderLevelCount;
    table.changeCellValue(1, row, 32);
    await Promise.resolve();

    expect(filterPlugin.filterStateManager.getFilterState(ageField).values).toEqual([24, 32]);

    filterPlugin.filterToolbar.show(1, 0, ['byValue']);
    await new Promise(resolve => setTimeout(resolve, 0));

    const checkboxes = Array.from(
      document.querySelectorAll('.vtable-filter-menu input[type="checkbox"]')
    ) as HTMLInputElement[];
    const cb24 = checkboxes.find(cb => cb.value === '24');
    const cb32 = checkboxes.find(cb => cb.value === '32');
    expect(cb24).toBeTruthy();
    expect(cb32).toBeTruthy();
    expect(cb24 && cb24.checked).toBe(true);
    expect(cb32 && cb32.checked).toBe(true);
  } finally {
    sheet.release();
    removeDom(container);
  }
});
